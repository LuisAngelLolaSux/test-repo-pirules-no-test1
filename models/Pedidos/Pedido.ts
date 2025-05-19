import mongoose, { Model, Schema } from 'mongoose';
import { PedidoType } from '@/typings/types';

const pedidoSchema = new Schema(
    {
        _id: {
            type: String,
            required: true,
        },

        statusPedido: {
            type: String,
            enum: [
                'Pendiente',
                'Cotizacion',
                'Procesando',
                'Completado',
                'Enviado',
                'Cancelado',
                'Error',
            ],
            default: 'Pendiente',
        },
        productos: [
            {
                producto: {
                    type: Schema.Types.ObjectId,
                    ref: 'Producto', // Referencia al modelo Productos
                    required: true,
                },
                nombreProducto: {
                    type: String,
                    required: true, // Guardar el nombre del producto en el pedido para evitar problemas si el producto se elimina o cambia
                },
                cantidad: {
                    type: Number,
                    default: 1,
                },
                variantesSeleccionada: [
                    {
                        id: { type: String, default: null }, // Nombre de la variante seleccionada
                        nombre: { type: String, default: null }, // Nombre de la variante seleccionada
                        subVariante: { type: String, default: null }, // Subvariante seleccionada, si existe
                        precio: { type: Number, required: true }, // Precio de la variante seleccionada
                    },
                ],
                precioProducto: {
                    type: Number, // Precio final de cada producto (precio * cantidad) considerando el precio de las variantes
                    required: true,
                },
                currency: {
                    type: String,
                    default: 'MXN',
                },
            },
        ],
        precioTotalPedido: {
            //posible remocion
            type: Number,
            default: null,
        },
        exchangeRate: {
            // added field to store the exchange rate used for conversion
            type: Number,
            default: null,
        },
        informacionCliente: {
            nombre: {
                type: String,
                default: null,
            },
            email: {
                type: String,
                default: null,
            },
            telefono: {
                type: String,
                default: null,
            },
            direccion: {
                calle: {
                    type: String,
                    default: null,
                },
                colonia: {
                    type: String,
                    default: null,
                },
                ciudad: {
                    type: String,
                    default: null,
                },
                estado: {
                    type: String,
                    default: null,
                },
                codigoPostal: {
                    type: String,
                    default: null,
                },
                numeroExterior: {
                    type: String,
                    default: null,
                },
                numeroInterior: {
                    type: String,
                    default: null,
                },
                datosAdicionales: {
                    type: String,
                    default: null,
                },
            },
        },
        informacionPago: {
            type: Schema.Types.ObjectId,
            ref: 'Billing',
            default: null,
        },
        metodoEnvio: {
            name: {
                type: String,
                default: null,
            },
            price: {
                type: Number,
                default: null,
            },
            days: {
                type: String,
                default: null,
            },
            id: {
                type: String,
                default: null,
            },
        },
        numeroRastreo: {
            //para envio de paqutes. Si el envio es por paqueteria, se debe de proporcionar el numero de rastreo
            type: String,
            default: null,
        },
        fechaEntregaEstimada: {
            //info de paqueteria/empresa
            type: Date,
            default: null,
        },
        fechaCompletado: {
            //el dia que se entrege el producto
            type: Date,
            default: null,
        },
        // Nuevo campo para guardar el texto del horario de recolección
        fechaRecoleccion: {
            type: String,
            default: null,
        },
        historialEstados: [
            //sirve para auditoria de los estados del pedido y soporte
            {
                estado: {
                    type: String,
                    default: 'Pendiente',
                },
                fechaCambio: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        descuento: {
            //por si se aplica un descuento
            codigo: {
                type: String,
                default: null,
            },
            monto: {
                //proposito: para saber cuanto se desconto del total del pedido
                type: Number,
                default: 0,
            },
        },
        impuestos: {
            //especificar cantidad de IVA
            type: Number,
            default: 0,
        },
        tarifaServicio: {
            //tarifa de servicio de Lola
            type: Number,
            default: 0,
        },
        notasCliente: {
            //notas adicionales que el cliente quiera agregar al pedido
            type: String,
            default: null,
        },
        //para saber que agente fue el que tomo el pedido
        agenteId: {
            type: Schema.Types.ObjectId,
            ref: 'BotConfig',
        },
        carritoId: {
            // Referencia al carrito
            type: String,
            default: null,
        },
        errores: [
            //por ejemplo si falla el pago o algun otro error
            {
                mensaje: {
                    type: String,
                    default: null,
                },
                fecha: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        etiquetas: [
            //etiquetas para clasificar los pedidos dependiendo del servicio o lo que sea necesario
            {
                type: String,
            },
        ],
        userId: {
            // Referencia al usuario/empresa a la que se le hizo el pedido
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        // Updated new field definition
        tipoPedido: {
            type: String,
            enum: ['Automatico', 'Manual', 'Orden'],
            default: null,
        },
    },
    { timestamps: true },
);

// Creamos el modelo
const Pedido: Model<PedidoType> =
    mongoose.models.Pedido || mongoose.model<PedidoType>('Pedido', pedidoSchema, 'Pedido');

export default Pedido;
