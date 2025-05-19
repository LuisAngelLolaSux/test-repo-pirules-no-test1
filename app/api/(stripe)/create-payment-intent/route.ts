import Pedido from '@/models/Pedidos/Pedido';
import { connectToDB } from '@/utils/mongoDB';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';
import User from '@/models/auth/User';
import { fetchExchangeRate } from '@/utils/EnviosManuales/server';
import { porcentajeDeComisionParaProductos, porcentajeDeComisionParaEnvios } from '@/lib/precios';
import { getOpcionesDeEntregaBackend } from '@/utils/AmPm/server';

export async function POST(request: NextRequest) {
    try {
        const { pedidoId, email, shippingOption, enviosConfig, frontExchangeRate } =
            await request.json();
        const frontExchangeRateNum = Number(frontExchangeRate);

        if (!shippingOption || !shippingOption.id) {
            return new NextResponse('Metodo de envio vacio', { status: 400 });
        }

        // Checar si es automatico el envio
        const isAutomatic = enviosConfig.trim().toLowerCase().includes('auto');
        //sacamos el exchangeRate en el back para corroborar
        const backExchangeRate = await fetchExchangeRate('USD', 'MXN');
        if (backExchangeRate > frontExchangeRateNum) {
            return new NextResponse('Error en el tipo de cambio', { status: 400 });
        }

        await connectToDB();
        const pedido = await Pedido.findOne({ _id: pedidoId });
        if (!pedido) {
            return new NextResponse('Pedido not Found', { status: 404 });
        }

        let envioFee = 0;
        if (isAutomatic) {
            // Usamos una funcion de backend para armar el carrito que necesita la funcion de getOpciones de ampm
            const opciones = await getOpcionesDeEntregaBackend(pedidoId);
            const matchingOption = opciones.find(
                (opt: any) =>
                    //revisamos que el id de la opcion de envio del front coincida
                    opt.tipoServicioId.toString() === shippingOption.id,
            );
            if (!matchingOption) {
                return new NextResponse('Opcion de envio invalida', { status: 400 });
            }
            //recordar que al precio de envio que recibimos de ampm le estamos agregando el 15% del costo, encime del precio base del envio
            const expectedPrice =
                matchingOption.total +
                matchingOption.total * (porcentajeDeComisionParaEnvios / 100);
            //se esta usando una tolerancia de 0.01 para revisar que el precio del front y el back coincidan, para evitar posibles problemas de paridad al hacer las converciones de datos
            if (Math.abs(expectedPrice - shippingOption.price) > 0.01) {
                return new NextResponse('Precio de envio invalido', { status: 400 });
            }
            envioFee = expectedPrice;
        }

        const precioTotalPedido = pedido?.precioTotalPedido;
        const userIdEmpresa = pedido.userId;
        // Se busca el Account con el ID de la empresa para obtener el stripeAccountId
        const user = await User.findOne({ _id: userIdEmpresa });
        if (!user) {
            return new NextResponse('Account not Found', { status: 404 });
        }
        const stripeAccountId = user.stripeAccountId;

        // Calcula el subtotal de los productos restandole el envioFee verificado
        const productoSubtotal = (precioTotalPedido || 0) - envioFee;

        // Calcula comision en los productos (porcentaje de 5% por ahora, definido en precios.ts)
        const porcentage = porcentajeDeComisionParaProductos / 100;
        const commission = productoSubtotal * porcentage;

        // Platform fee = envioFee + commission
        const platformFee = envioFee + commission;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(precioTotalPedido! * 100),
            currency: 'mxn',
            automatic_payment_methods: { enabled: true },
            description: 'Checkout Payment',
            application_fee_amount: Math.round(platformFee * 100),
            transfer_data: {
                destination: stripeAccountId,
            },
            metadata: {
                userId: userIdEmpresa.toString(),
                pedidoId: pedidoId,
                customerEmail: email,
                shippingOption: JSON.stringify(shippingOption),
                enviosConfig: JSON.stringify(enviosConfig),
                exchangeRate: frontExchangeRateNum.toString(),
            },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Internal Error:', error);
        return new NextResponse(JSON.stringify({ error: `Internal Server Error: ${error}` }), {
            status: 500,
        });
    }
}
