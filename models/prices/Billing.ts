import mongoose, { Model, Schema } from 'mongoose';
import { BillingType } from '@/typings/types';

const BillingSchema = new mongoose.Schema(
    {
        deadlineDate: Date, // Fecha límite de pago siempre al final del mes
        pending: [
            {
                service: String,
                price: Number, // costo calculado desde nuestro lado
                dateOfCharge: Date, // Fecha en la que se hizo el cargo, es la fecha en la que se crea tu bot
                status: { type: String, enum: ['pending', 'inactive'], default: 'pending' },
            },
        ],
        history: [
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
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

// Creamos el modelo
const Billing: Model<BillingType> =
    mongoose.models.Billing || mongoose.model<BillingType>('Billing', BillingSchema, 'Billing');

export default Billing;
