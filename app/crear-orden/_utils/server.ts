'use server';

import { sendOrderCreationClienteEmail, sendOrderCreationEmpresaEmail } from '@/lib/mail';
import { OrderData } from '@/mails/types';
import User from '@/models/auth/User';
import ConfiguracionUsuario from '@/models/configuraciones/ConfiguracioneUsuario';
import Pedido from '@/models/Pedidos/Pedido';
import Producto from '@/models/productos/Productos';
import { connectToDB } from '@/utils/mongoDB';

export const sentEmailsOrdenCreada = async (pedido: any) => {
    try {
        await connectToDB();
        const calle = pedido.informacionCliente.direccion.calle;
        const numeroExterior = pedido.informacionCliente.direccion.numeroExterior;
        const numeroInterior = pedido.informacionCliente.direccion.numeroInterior;
        const ciudad = pedido.informacionCliente.direccion.ciudad;
        const estado = pedido.informacionCliente.direccion.estado;
        const codigoPostal = pedido.informacionCliente.direccion.codigoPostal;
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

        const existingPedidoInfo = await Pedido.findOne({
            _id: pedido._id,
        });

        if (!existingPedidoInfo) {
            throw new Error('Pedido Info no encontrada');
        }

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
                subvariante: producto.variantesSeleccionada?.[0]?.subVariante || null,
                cantidad: producto.cantidad,
                precio: producto.precioProducto,
                // Added: Include currency to ensure correct conversion in mails
                currency: producto.currency || 'MXN',
            };
        });
        const userConfig = await ConfiguracionUsuario.findOne({
            userId: existingPedidoInfo.userId,
        });
        const userData = await User.findById(existingPedidoInfo.userId);

        const orden: OrderData = {
            idDelPedido: pedido._id,
            detalles: {
                nombreCliente: pedido.informacionCliente.nombre,
                correoCliente: pedido.informacionCliente.email,
                digitosTarjeta: 'No Aplica', // No aplica en orden creada
                typoTarjeta: 'No Aplica', // No aplica en orden creada
                numeroGuia: 'No Aplica', // No aplica en orden creada
                linkGuía: 'No Aplica', // No aplica en orden creada
                tiempoRecoleccion: 'No Aplica', // No aplica en orden creada
                tiempoDeEntrega: 0, // No aplica en orden creada
                direccionDeEnvio: direccionString,
                numeroTelefono: pedido.informacionCliente.telefono,
            },
            usuarioLola: {
                nombre: userConfig?.infoEmpresa?.nombreEmpresa || 'Cliente Lola',
                email: userConfig?.emailSecundario || userData?.email,
                logo: userConfig?.infoEmpresa?.imagenUrl || 'https://www.lolasux.com/L.png',
                colors: {
                    primario: userConfig?.infoEmpresa?.colorEmpresa?.principal || '#33A64B',
                    texto: userConfig?.infoEmpresa?.colorEmpresa?.texto || '#FFFFFF',
                },
            },
            productos,
            // Ensure exchangeRate is attached so email components convert USD prices correctly.
            exchangeRate: pedido.exchangeRate,
        };

        if (userData?.email === 'coreysolar.distribucion@gmail.com') {
            await sendOrderCreationEmpresaEmail(
                userConfig?.emailSecundario || userData.email,
                orden,
                'Corey Solar <comercial@coreysolar.com>',
            );
            await sendOrderCreationClienteEmail(
                pedido.informacionCliente.email,
                orden,
                'Corey Solar <comercial@coreysolar.com>',
            );
        } else {
            await sendOrderCreationEmpresaEmail(
                userConfig?.emailSecundario || userData.email,
                orden,
            );
            await sendOrderCreationClienteEmail(pedido.informacionCliente.email, orden);
        }
    } catch (error) {
        console.error(error);
        throw new Error('sentEmailsOrdenCreada error');
    }
};
