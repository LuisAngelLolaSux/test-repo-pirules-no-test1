import { NextRequest, NextResponse } from 'next/server';
import Billing from '@/models/prices/Billing';
import Pedido from '@/models/Pedidos/Pedido';
import Producto from '@/models/productos/Productos';
import User from '@/models/auth/User';
import { connectToDB } from '@/utils/mongoDB';
import BillingEmpresa from '@/models/billingEmpresas/BillingEmpresas';
import { OrderData, ManualOrderData } from '@/mails/types';
import ConfiguracionUsuario from '@/models/configuraciones/ConfiguracioneUsuario';
import {
    sendOrderConfirmationClienteEmail,
    sendOrderConfirmationEmpresaEmail,
    sendOrderConfirmationEmpresaEmailManual,
    sendOrderConfirmationClienteEmailManual,
} from '@/lib/mail';
import { getNumerodeGuia, obtenerSiguienteHorarioDisponible } from '@/utils/AmPm/server';
import Almacen from '@/models/almacenesEnvios/Almacen';
import EnviosPendientesAmPm from '@/models/almacenesEnvios/EnviosPendientes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let creditosAdquiridos = null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret

// Función helper con reintentos (backoff) para recuperar el charge y su propiedad application_fee desde Stripe.
// Esta función intenta recuperar el charge hasta maxAttempts veces, esperando delayMs entre cada intento.
async function retrieveChargeWithBackoff(chargeId: string, maxAttempts = 3, delayMs = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const charge = await stripe.charges.retrieve(chargeId);
        if (charge.application_fee) {
            return charge;
        }
        if (attempt < maxAttempts) {
            console.log(
                `Attempt ${attempt} failed to get application_fee. Retrying in ${delayMs}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    // Return the last retrieved charge even if application_fee is still missing
    return await stripe.charges.retrieve(chargeId);
}

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature'); // Get the Stripe signature
    let event;
    let userId = '';
    let enviosConfig = null;
    try {
        // Raw body needed for Stripe signature verification
        const payload = await req.text();
        await connectToDB();

        if (endpointSecret && sig) {
            // Verify the event with the signature
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
            if (event?.data?.object?.metadata?.userId) {
                userId = event.data.object.metadata.userId;
            } else if (event?.data?.object?.metadata?.pedidoId) {
                const pedidoForId = await Pedido.findById(event.data.object.metadata.pedidoId);
                const producto = await Producto.findById(pedidoForId?.productos[0].producto);
                userId = producto?.userId?.toString() || '';
            }
            creditosAdquiridos = event?.data?.object?.metadata?.creditosAdquiridos;
            enviosConfig = event?.data?.object?.metadata?.enviosConfig;
        } else {
            return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
        }
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.`, err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 },
        );
    }
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const intentSucceded = event.data.object;
            console.log('stripe event payment.Intent.succeded', event);

            if (creditosAdquiridos) {
                try {
                    const user = await User.findOneAndUpdate(
                        { _id: userId },
                        { $inc: { lolaCredits: creditosAdquiridos } },
                        { new: true },
                    );
                    if (user) {
                        await user.save();
                        console.log('Credits succsefully added to user');
                    }
                    const existingBillingInfo = await BillingEmpresa.findOneAndUpdate(
                        {
                            userId: userId,
                            'historialPagos.transactionId': intentSucceded.id,
                        },
                        {
                            $set: {
                                'historialPagos.$.status': 'completed',
                            },
                        },
                        { new: true },
                    );
                    if (existingBillingInfo) {
                        await existingBillingInfo.save();
                        console.log('Billing info updated');
                    }
                } catch (error) {
                    console.log('Error adding credits to user', error);
                }
                break;
            }

            try {
                const paymentMethodResult = await stripe.paymentMethods.retrieve(
                    intentSucceded.payment_method,
                );
                const cardDetails = paymentMethodResult.card;

                // Retrieve the latest charge from the payment intent
                const latestCharge = await stripe.charges.retrieve(intentSucceded.latest_charge);
                const receiptUrl = latestCharge?.receipt_url || '';

                const existingBillingInfo = await Billing.findOneAndUpdate(
                    {
                        userId: userId,
                        'history.transactionId': intentSucceded.id,
                    },
                    {
                        $set: {
                            'history.$.stripeRecipt': receiptUrl,
                            'history.$.status': 'completed',
                            'history.$.paymentMethod': {
                                brand: cardDetails.brand,
                                country: cardDetails.country,
                                exp_month: cardDetails.exp_month,
                                exp_year: cardDetails.exp_year,
                                funding: cardDetails.funding,
                                network: cardDetails.network,
                                last4: cardDetails.last4,
                            },
                        },
                    },
                    { new: true },
                );
                if (existingBillingInfo) {
                    await existingBillingInfo.save();
                    const billingHistoryId =
                        existingBillingInfo.history[existingBillingInfo.history.length - 1]._id;
                    console.log('Billing info updated');

                    const existingPedidoInfo = await Pedido.findOneAndUpdate(
                        {
                            _id: intentSucceded.metadata.pedidoId,
                        },
                        {
                            $set: {
                                statusPedido: 'Completado',
                                informacionPago: billingHistoryId,
                            },
                            $push: {
                                historialEstados: [{ estado: 'Completado', fecha: new Date() }],
                            },
                        },
                        { new: true },
                    );
                    if (existingPedidoInfo) {
                        const idsProducs = existingPedidoInfo.productos.map((producto) =>
                            producto.producto.toString(),
                        );

                        const allProducts = await Producto.find({
                            _id: { $in: idsProducs }, // Buscar por _id en la lista de productos
                        });
                        const productos = existingPedidoInfo.productos.map((producto) => {
                            const productoEncontrado = allProducts.find(
                                (p) => p._id.toString() === producto.producto.toString(),
                            );
                            const varianteEncontrada = productoEncontrado?.variantesCombinadas.find(
                                (v) => v._id.toString() === producto.variantesSeleccionada[0]?.id,
                            );
                            return {
                                nombre: producto.nombreProducto,
                                imagen:
                                    varianteEncontrada?.imagenes?.[0] ||
                                    productoEncontrado?.imagenes?.[0] ||
                                    'https://www.lolasux.com/L.png',
                                variante: producto.variantesSeleccionada?.[0]?.nombre || null,
                                subvariante:
                                    producto.variantesSeleccionada?.[0]?.subVariante || null,
                                cantidad: producto.cantidad,
                                precio: producto.precioProducto,
                                currency: producto.currency || 'MXN', // Ensure currency is set
                            };
                        });
                        if (enviosConfig.trim().includes('Auto')) {
                            const userConfig = await ConfiguracionUsuario.findOne({ userId });
                            const userData = await User.findById(userId);
                            const almacen = await Almacen.findOne({ userId });
                            const latestCharge = await stripe.charges.retrieve(
                                intentSucceded.latest_charge,
                            );

                            const shippingOption = JSON.parse(
                                intentSucceded.metadata.shippingOption,
                            );
                            const numeroGuia = await getNumerodeGuia(
                                intentSucceded.metadata.pedidoId,
                                userId,
                                shippingOption.id,
                            );
                            const calle = existingPedidoInfo.informacionCliente.direccion.calle;
                            const numeroExterior =
                                existingPedidoInfo.informacionCliente.direccion.numeroExterior;
                            const numeroInterior =
                                existingPedidoInfo.informacionCliente.direccion.numeroInterior;
                            const ciudad = existingPedidoInfo.informacionCliente.direccion.ciudad;
                            const estado = existingPedidoInfo.informacionCliente.direccion.estado;
                            const codigoPostal =
                                existingPedidoInfo.informacionCliente.direccion.codigoPostal;
                            const partes = [
                                calle ? `Calle: ${calle}` : null,
                                numeroExterior ? `No. Ext: ${numeroExterior}` : null,
                                numeroInterior ? `No. Int: ${numeroInterior}` : null,
                                ciudad ? `Ciudad: ${ciudad}` : null,
                                estado ? `Estado: ${estado}` : null,
                                codigoPostal ? `C.P.: ${codigoPostal}` : null,
                            ];

                            // Filtra valores nulos o indefinidos y únelos con comas
                            const direccionString = partes.filter(Boolean).join(', ');

                            const horario = await obtenerSiguienteHorarioDisponible(
                                almacen?.horario,
                            );
                            const orden: OrderData = {
                                usuarioLola: {
                                    nombre:
                                        userConfig?.infoEmpresa?.nombreEmpresa || 'Cliente Lola',
                                    email: userConfig?.emailSecundario || userData.email,
                                    logo:
                                        userConfig?.infoEmpresa?.imagenUrl ||
                                        'https://www.lolasux.com/L.png',
                                    colors: {
                                        primario:
                                            userConfig?.infoEmpresa?.colorEmpresa?.principal ||
                                            '#33A64B',
                                        texto:
                                            userConfig?.infoEmpresa?.colorEmpresa?.texto ||
                                            '#FFFFFF',
                                    },
                                },
                                productos,
                                idDelPedido: intentSucceded.metadata.pedidoId,
                                detalles: {
                                    nombreCliente:
                                        existingPedidoInfo.informacionCliente.nombre ||
                                        'Sin nombre',
                                    correoCliente: intentSucceded.metadata.customerEmail,
                                    digitosTarjeta: latestCharge.payment_method_details.card.last4,
                                    typoTarjeta: latestCharge.payment_method_details.card.brand,
                                    numeroGuia,
                                    linkGuía: `https://www.lolasux.com/dashboard/pedido/guia/${numeroGuia}`,
                                    tiempoRecoleccion: `El ${horario?.texto}` || 'En 2 dias aprox.',
                                    tiempoDeEntrega:
                                        horario?.dias + shippingOption.days || 'varios',
                                    direccionDeEnvio: direccionString,
                                    numeroTelefono:
                                        existingPedidoInfo.informacionCliente.telefono ||
                                        'Desconocido',
                                },
                                exchangeRate: existingPedidoInfo.exchangeRate ?? undefined,
                            };

                            const fecha = horario?.principio.split('T')[0];
                            const totalPaquetes = productos.reduce(
                                (sum, prod) => sum + prod.cantidad,
                                0,
                            );

                            await Pedido.findOneAndUpdate(
                                {
                                    _id: intentSucceded.metadata.pedidoId,
                                },
                                {
                                    numeroRastreo: numeroGuia,
                                    fechaRecoleccion: horario?.texto,
                                },
                            );

                            const enviosPendientes = await EnviosPendientesAmPm.findOne({
                                userId,
                                fecha,
                            });

                            if (enviosPendientes) {
                                enviosPendientes.paquetes += totalPaquetes;
                                await enviosPendientes.save();
                            } else {
                                const newEnviosPendientes = new EnviosPendientesAmPm({
                                    fecha: fecha || 'unknown',
                                    paquetes: totalPaquetes,
                                    userId,
                                });
                                await newEnviosPendientes.save();
                            }

                            await sendOrderConfirmationEmpresaEmail(
                                userConfig?.emailSecundario || userData.email,
                                orden,
                            );

                            await sendOrderConfirmationClienteEmail(
                                intentSucceded.metadata.customerEmail,
                                orden,
                            );
                        } else {
                            const userConfig = await ConfiguracionUsuario.findOne({ userId });
                            const userData = await User.findById(userId);
                            const latestCharge = await stripe.charges.retrieve(
                                intentSucceded.latest_charge,
                            );

                            const shippingOption = JSON.parse(
                                intentSucceded.metadata.shippingOption,
                            );
                            const calle = existingPedidoInfo.informacionCliente.direccion.calle;
                            const numeroExterior =
                                existingPedidoInfo.informacionCliente.direccion.numeroExterior;
                            const numeroInterior =
                                existingPedidoInfo.informacionCliente.direccion.numeroInterior;
                            const ciudad = existingPedidoInfo.informacionCliente.direccion.ciudad;
                            const estado = existingPedidoInfo.informacionCliente.direccion.estado;
                            const codigoPostal =
                                existingPedidoInfo.informacionCliente.direccion.codigoPostal;
                            const partes = [
                                calle ? `Calle: ${calle}` : null,
                                numeroExterior ? `No. Ext: ${numeroExterior}` : null,
                                numeroInterior ? `No. Int: ${numeroInterior}` : null,
                                ciudad ? `Ciudad: ${ciudad}` : null,
                                estado ? `Estado: ${estado}` : null,
                                codigoPostal ? `C.P.: ${codigoPostal}` : null,
                            ];

                            // Filtra valores nulos o indefinidos y únelos con comas
                            const direccionString = partes.filter(Boolean).join(', ');

                            const orden: ManualOrderData = {
                                usuarioLola: {
                                    nombre:
                                        userConfig?.infoEmpresa?.nombreEmpresa || 'Cliente Lola',
                                    email: userConfig?.emailSecundario || userData.email,
                                    logo:
                                        userConfig?.infoEmpresa?.imagenUrl ||
                                        'https://www.lolasux.com/L.png',
                                    colors: {
                                        primario:
                                            userConfig?.infoEmpresa?.colorEmpresa?.principal ||
                                            '#33A64B',
                                        texto:
                                            userConfig?.infoEmpresa?.colorEmpresa?.texto ||
                                            '#FFFFFF',
                                    },
                                },
                                productos,
                                idDelPedido: intentSucceded.metadata.pedidoId,
                                detalles: {
                                    nombreCliente:
                                        existingPedidoInfo.informacionCliente.nombre ||
                                        'Sin nombre',
                                    correoCliente: intentSucceded.metadata.customerEmail,
                                    digitosTarjeta: latestCharge.payment_method_details.card.last4,
                                    typoTarjeta: latestCharge.payment_method_details.card.brand,
                                    linkGuía: `https://www.lolasux.com/dashboard/pedido/guia/${intentSucceded.metadata.pedidoId}`,
                                    direccionDeEnvio: direccionString,
                                    numeroTelefono:
                                        existingPedidoInfo.informacionCliente.telefono ||
                                        'Desconocido',
                                    tipoEnvio: shippingOption.name,
                                    diasEstimadosEntrega: shippingOption.days.toString(),
                                },
                                exchangeRate: existingPedidoInfo.exchangeRate ?? undefined,
                            };
                            await Pedido.findOneAndUpdate(
                                {
                                    _id: intentSucceded.metadata.pedidoId,
                                },
                                { numeroRastreo: intentSucceded.metadata.pedidoId },
                            );
                            await sendOrderConfirmationEmpresaEmailManual(
                                userConfig?.emailSecundario || userData.email,
                                orden,
                            );

                            await sendOrderConfirmationClienteEmailManual(
                                intentSucceded.metadata.customerEmail,
                                orden,
                            );
                        }
                    }
                }
            } catch (error) {
                console.log('Error registrando pago', error);
            }
            break;
        case 'payment_intent.payment_failed':
            //por si es un pago de creditos de lola
            if (creditosAdquiridos) {
                try {
                    const paymentFailed = event.data.object;
                    const existingBillingInfo = await BillingEmpresa.findOneAndUpdate(
                        {
                            userId: userId,
                            'historialPagos.transactionId': paymentFailed.id,
                        },
                        {
                            $set: {
                                'historialPagos.$.status': 'failed',
                                'historialPagos.$.paymentMethod': {
                                    brand: paymentFailed.last_payment_error.payment_method.card
                                        .brand,
                                    country:
                                        paymentFailed.last_payment_error.payment_method.card
                                            .country,
                                    exp_month:
                                        paymentFailed.last_payment_error.payment_method.card
                                            .exp_month,
                                    exp_year:
                                        paymentFailed.last_payment_error.payment_method.card
                                            .exp_year,
                                    funding:
                                        paymentFailed.last_payment_error.payment_method.card
                                            .funding,
                                    network:
                                        paymentFailed.last_payment_error.payment_method.card
                                            .network,
                                    last4: paymentFailed.last_payment_error.payment_method.card
                                        .last4,
                                },
                            },
                        },
                        { new: true },
                    );
                    if (existingBillingInfo) {
                        await existingBillingInfo.save();
                        console.log('Billing info updated payment failed');
                    }
                } catch (error) {
                    console.log('Error adding credits to user', error);
                }
                break;
            }
            const paymentFailed = event.data.object;
            console.log(`Payment failed for ${paymentFailed.amount}.`);
            //para el caso de pedidos de clientes de las empresas.
            try {
                const paymentFailed = event.data.object;
                console.log('`Payment failed for ${paymentFailed.amount}.`');
                const existingBillingInfo = await Billing.findOneAndUpdate(
                    {
                        userId: userId,
                        'history.transactionId': paymentFailed.id,
                    },
                    {
                        $set: {
                            'history.$.status': 'failed',
                            'history.$.paymentMethod': {
                                brand: paymentFailed.last_payment_error.payment_method.card.brand,
                                country:
                                    paymentFailed.last_payment_error.payment_method.card.country,
                                exp_month:
                                    paymentFailed.last_payment_error.payment_method.card.exp_month,
                                exp_year:
                                    paymentFailed.last_payment_error.payment_method.card.exp_year,
                                funding:
                                    paymentFailed.last_payment_error.payment_method.card.funding,
                                network:
                                    paymentFailed.last_payment_error.payment_method.card.network,
                                last4: paymentFailed.last_payment_error.payment_method.card.last4,
                            },
                        },
                    },
                    { new: true },
                );
                if (existingBillingInfo) {
                    await existingBillingInfo.save();
                    console.log('Billing info updated payment failed');
                    const billingHistoryId =
                        existingBillingInfo.history[existingBillingInfo.history.length - 1]._id;
                    const existingPedidoInfo = await Pedido.findOneAndUpdate(
                        {
                            _id: paymentFailed.metadata.pedidoId,
                        },
                        {
                            $set: {
                                statusPedido: 'Error',
                                informacionPago: billingHistoryId,
                            },
                            $push: {
                                historialEstados: [
                                    {
                                        estado: `Error: ${paymentFailed.last_payment_error.message}`,
                                        fecha: new Date(),
                                    },
                                ],
                                errores: [
                                    {
                                        mensaje: paymentFailed.last_payment_error.decline_code,
                                        fecha: new Date(),
                                    },
                                ],
                            },
                        },
                        { new: true },
                    );
                    if (existingPedidoInfo) {
                        await existingPedidoInfo.save();
                        console.log('Pedido info updated payment failed', existingPedidoInfo);
                        //se regresan al inventario los productos que se intentaron pedir
                        existingPedidoInfo.productos.forEach(async (producto) => {
                            // Actualiza la cantidad en el inventario de cada producto
                            const productoInventario = await Producto.findOneAndUpdate(
                                { _id: producto.producto },
                                { $inc: { inventario: producto.cantidad } },
                                { new: true },
                            );
                            if (productoInventario) {
                                await productoInventario.save();
                            }
                        });
                    }
                }
            } catch (error) {
                console.log('Error handling payment failed event', error);
            }
            break;
        // Add more cases for different event types as needed
        case 'charge.succeeded':
            //await new Promise((resolve) => setTimeout(resolve, 1000));
            if (creditosAdquiridos) {
                try {
                    const charge = event.data.object;
                    const existingBillingEmpresa = await BillingEmpresa.findOneAndUpdate(
                        {
                            userId: userId,
                            'historialPagos.transactionId': charge.payment_intent,
                        },
                        {
                            $set: {
                                'historialPagos.$.stripeRecipt': charge.receipt_url,
                                'historialPagos.$.status': 'completed',
                                'historialPagos.$.paymentMethod': {
                                    brand: charge.payment_method_details.card.brand,
                                    country: charge.payment_method_details.card.country,
                                    exp_month: charge.payment_method_details.card.exp_month,
                                    exp_year: charge.payment_method_details.card.exp_year,
                                    funding: charge.payment_method_details.card.funding,
                                    network: charge.payment_method_details.card.network,
                                    last4: charge.payment_method_details.card.last4,
                                },
                            },
                        },
                        { new: true },
                    );
                    if (existingBillingEmpresa) {
                        console.log('BillingEmpresa info updated for charge succeeded');
                    } else {
                        const existingBillingEmpresa = await BillingEmpresa.findOne({
                            userId: userId,
                        });

                        if (existingBillingEmpresa) {
                            const existingPago = existingBillingEmpresa.historialPagos.find(
                                (pago) => pago.transactionId === charge.payment_intent,
                            );

                            if (existingPago) {
                                existingPago.stripeRecipt = charge.receipt_url;
                                existingPago.status = 'completed';
                                existingPago.paymentMethod = [
                                    {
                                        brand: charge.payment_method_details.card.brand,
                                        country: charge.payment_method_details.card.country,
                                        exp_month: charge.payment_method_details.card.exp_month,
                                        exp_year: charge.payment_method_details.card.exp_year,
                                        funding: charge.payment_method_details.card.funding,
                                        network: charge.payment_method_details.card.network,
                                        last4: charge.payment_method_details.card.last4,
                                    },
                                ];
                            } else {
                                existingBillingEmpresa.historialPagos.push({
                                    transactionId: charge.payment_intent,
                                    service: charge.description,
                                    dateOfCharge: new Date(),
                                    dateOfPayment: new Date(),
                                    price: charge.amount / 100,
                                    paymentMethod: [
                                        {
                                            brand: charge.payment_method_details.card.brand,
                                            country: charge.payment_method_details.card.country,
                                            exp_month: charge.payment_method_details.card.exp_month,
                                            exp_year: charge.payment_method_details.card.exp_year,
                                            funding: charge.payment_method_details.card.funding,
                                            network: charge.payment_method_details.card.network,
                                            last4: charge.payment_method_details.card.last4,
                                        },
                                    ],
                                    stripeRecipt: charge.receipt_url,
                                    status: 'completed',
                                    fees: 0,
                                    tax: 0,
                                });
                            }
                            await existingBillingEmpresa.save();
                            console.log('BillingEmpresa historialPagos updated');
                        } else {
                            console.log('No existing BillingEmpresa found. Creating new document.');
                            const billingEmpresa = await BillingEmpresa.create({
                                historialPagos: [
                                    {
                                        transactionId: charge.payment_intent,
                                        service: charge.description,
                                        dateOfCharge: new Date(),
                                        dateOfPayment: new Date(),
                                        price: charge.amount / 100,
                                        paymentMethod: [
                                            {
                                                brand: charge.payment_method_details.card.brand,
                                                country: charge.payment_method_details.card.country,
                                                exp_month:
                                                    charge.payment_method_details.card.exp_month,
                                                exp_year:
                                                    charge.payment_method_details.card.exp_year,
                                                funding: charge.payment_method_details.card.funding,
                                                network: charge.payment_method_details.card.network,
                                                last4: charge.payment_method_details.card.last4,
                                            },
                                        ],
                                        stripeRecipt: charge.receipt_url,
                                        status: 'completed',
                                        fees: 0,
                                        tax: 0,
                                    },
                                ],
                                userId: userId,
                            });

                            await billingEmpresa.save();
                            console.log('BillingEmpresa document created');
                        }
                    }
                } catch (error) {
                    console.log('Error handling charge succeeded event for BillingEmpresa', error);
                }
            } else {
                try {
                    // Use the backoff mechanism to retrieve the charge with application_fee
                    const stripeConnectCharge = await retrieveChargeWithBackoff(
                        event.data.object.id,
                    );
                    if (!stripeConnectCharge.application_fee) {
                        console.log('No application fee found after retry attempts.');
                    } else {
                        const stripeAppFee = await stripe.applicationFees.retrieve(
                            stripeConnectCharge.application_fee,
                        );
                        const idChargeConnect = stripeAppFee.charge;
                        // Actualiza el charge de connect con el metadato necesario
                        await stripe.charges.update(
                            idChargeConnect,
                            {
                                metadata: {
                                    customerEmail: event.data.object.metadata.customerEmail,
                                    last4: event.data.object.payment_method_details.card.last4,
                                },
                            },
                            { stripeAccount: event.data.object.destination },
                        );
                        const charge = event.data.object;
                        const existingBillingInfo = await Billing.findOneAndUpdate(
                            { userId: userId, 'history.transactionId': charge.payment_intent },
                            {
                                $set: {
                                    'history.$.stripeRecipt': charge.receipt_url,
                                    'history.$.status': 'completed',
                                    'history.$.paymentMethod': {
                                        brand: charge.payment_method_details.card.brand,
                                        country: charge.payment_method_details.card.country,
                                        exp_month: charge.payment_method_details.card.exp_month,
                                        exp_year: charge.payment_method_details.card.exp_year,
                                        funding: charge.payment_method_details.card.funding,
                                        network: charge.payment_method_details.card.network,
                                        last4: charge.payment_method_details.card.last4,
                                    },
                                },
                            },
                            { new: true },
                        );
                        if (existingBillingInfo) {
                            console.log('Billing info updated charge succeeded');
                        }
                    }
                } catch (error) {
                    console.log('Error handling charge succeeded event for Billing', error);
                }
            }
            break;

        case 'payment_intent.created':
            const intent = event.data.object;
            const intentId = intent.id;
            if (creditosAdquiridos) {
                try {
                    const existingBillingEmpresa = await BillingEmpresa.findOne({
                        userId: userId,
                    });

                    if (existingBillingEmpresa) {
                        const existingPayment = existingBillingEmpresa.historialPagos.find(
                            (pago) => pago.transactionId === intent.id,
                        );
                        // Instead of pushing a new (incomplete) entry, skip creation
                        // and let charge.succeeded handle creating/updating the entry.
                        if (!existingPayment) {
                            console.log(
                                'Skipping creation in payment_intent.created; waiting for charge.succeeded.',
                            );
                            // Optionally, you could create an entry placeholder here if desired.
                        } else {
                            console.log('historialPagos already contains this transactionId');
                        }
                    } else {
                        if (!intent.id.startsWith('ch')) {
                            // Optionally, log that no BillingEmpresa exists. Creation will happen in charge.succeeded.
                            console.log(
                                'No existing BillingEmpresa; waiting for charge.succeeded to create document.',
                            );
                        } else {
                            console.log('Charge event detected. No action taken.');
                        }
                    }
                } catch (error) {
                    console.log('Error handling BillingEmpresa document', error);
                }
                break;
            }
            try {
                const existingBillingInfo = await Billing.findOne({
                    userId: userId,
                    transactionId: intent.payment_intent,
                });

                if (existingBillingInfo) {
                    // Handle the case when billing info already exists
                    // You can update the existing document here if needed
                    existingBillingInfo.history.push({
                        transactionId: intent.id,
                        service: intent.description,
                        dateOfCharge: new Date(),
                        dateOfPayment: new Date(),
                        price: intent.amount / 100,
                        paymentMethod: [],
                        stripeRecipt: '',
                        status: 'processing',
                        fees: intent.application_fee_amount / 100,
                        tax: 0,
                    });
                    await existingBillingInfo.save();
                    console.log('Existing Billing info saved');
                } else if (!intentId.startsWith('ch')) {
                    const billingInfo = await Billing.create({
                        history: [
                            {
                                transactionId: intent.id,
                                service: intent.description,
                                dateOfCharge: new Date(),
                                dateOfPayment: new Date(),
                                price: intent.amount / 100,
                                paymentMethod: [],
                                stripeRecipt: '',
                                status: 'processing',
                                fees: 0,
                                tax: 0,
                            },
                        ],
                        userId: userId,
                    });
                    console.log('Billing info created');
                    await billingInfo.save();
                }
            } catch (error) {
                console.log('Error registrando pago', error);
                break;
            }

        case 'application_fee.created':
            console.log('application_fee.created ', event);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
}
