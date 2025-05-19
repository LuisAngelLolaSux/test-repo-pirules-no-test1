import mongoose, { Schema, Model } from 'mongoose';
import { BillingEmpresaType } from '@/typings/types';
import { string } from 'zod';

const direccionFacturacionSchema = new Schema({
    razonSocial: { type: String, default: '' },
    rfc: { type: String, default: '' },
    calle: { type: String, default: '' },
    colonia: { type: String, default: '' },
    numInt: { type: String, default: '' },
    numExt: { type: String, default: '' },
    codigoPostal: { type: String, default: '' },
    pais: { type: String, default: '' },
    estado: { type: String, default: '' },
    ciudad: { type: String, default: '' },
    email: { type: String, default: '' },
    telefono: { type: String, default: '' },
});

const BillingEmpresaSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Referencia al modelo de usuario
            required: true,
        },
        recargaAutomatica: {
            cantidadDeRecarga: { type: Number, default: null },
            minimoCreditos: { type: Number, default: null },
            activada: { type: Boolean, default: false },
        },

        // Dirección de facturación
        direccionFacturacion: {
            type: direccionFacturacionSchema,
            default: null,
        },

        // Detalles de consumo de créditos
        usoCreditos: [
            {
                fecha: { type: Date, required: true }, // Fecha del consumo
                cantidad: { type: Number, required: true }, // Cantidad de créditos utilizados
                descripcion: { type: String }, // Ejemplo: "API analisis de datos"
            },
        ],

        // Historial de pagos
        historialPagos: [
            {
                transactionId: { type: String, required: true }, // ID de la transacción en stripe, convertir a un array de strings y poner defult,
                service: String,
                dateOfCharge: Date,
                dateOfPayment: Date, // Fecha de pago stripe
                price: { type: Number, default: 0 },
                paymentMethod: [
                    {
                        brand: { type: String, default: '' },
                        country: { type: String, default: '' },
                        exp_month: { type: Number, default: 0 },
                        exp_year: { type: Number, default: 0 },
                        funding: { type: String, default: '' },
                        network: { type: String, default: '' },
                        last4: { type: String, default: '' },
                    },
                ],
                stripeRecipt: { type: String, default: '' }, // Recibo de pago
                status: {
                    type: String,
                    enum: ['completed', 'refunded', 'failed', 'processing'],
                    default: 'processing',
                },
                fees: { type: Number, default: 0 }, // Comisiones si aplica
                tax: { type: Number, default: 0 }, // Impuestos si aplican
            },
        ],

        // Suscripciones activas
        suscripciones: [
            {
                nombrePlan: { type: String, default: '' }, // Ejemplo: "Plan API Avanzado"
                fechaRenovacion: { type: Date, default: Date.now }, // Fecha de renovación
                costo: { type: Number, default: 0 }, // Ejemplo: "$49.99/mes"
            },
        ],
        // Métodos de pago
        paymentMethod: [
            {
                stripePaymentMethodId: { type: String, default: '' },
            },
        ],
        // Timestamps automáticos para creación y actualización
    },
    { timestamps: true },
);

// Creamos el modelo
const BillingEmpresa: Model<BillingEmpresaType> =
    mongoose.models.BillingEmpresa ||
    mongoose.model<BillingEmpresaType>('BillingEmpresa', BillingEmpresaSchema, 'BillingEmpresa');

export default BillingEmpresa;
