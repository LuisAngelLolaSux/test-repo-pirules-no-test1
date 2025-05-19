import mongoose, { Model } from 'mongoose';
import { CarritoWhatsappType } from '@/typings/types';

const CarritoWhatsappSchema = new mongoose.Schema(
    {
        numero: { type: String, required: true }, // Número de teléfono del celular
        botId: { type: String, required: true },
        carrito: {
            type: [
                {
                    productoId: { type: String, required: true },
                    cantidad: { type: Number, required: true },
                    variante: { type: String },
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

// Creamos el modelo
const CarritoWhatsapp: Model<CarritoWhatsappType> =
    mongoose.models.CarritoWhatsapp ||
    mongoose.model<CarritoWhatsappType>(
        'CarritoWhatsapp',
        CarritoWhatsappSchema,
        'CarritoWhatsapp',
    );

export default CarritoWhatsapp;
