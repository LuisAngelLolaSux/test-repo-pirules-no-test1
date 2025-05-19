import mongoose, { Model } from 'mongoose';
import { NumerosWhatsappType } from '@/typings/types';

const NumerosWhatsappSchema = new mongoose.Schema(
    {
        numeroTelefono: { type: String, required: true }, // Número de teléfono del celular
        token: { type: String, required: true }, // Token de autenticación del bot
        phoneMetaId: { type: String, default: null },
        wabaMetaId: { type: String, default: null },
        lastActiveDate: { type: Date, default: null }, // Fecha de la última actividad del celular
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID del usuario/empresa propietario del celular
    },
    { timestamps: true },
);

// Creamos el modelo
const NumerosWhatsapp: Model<NumerosWhatsappType> =
    mongoose.models.NumerosWhatsapp ||
    mongoose.model<NumerosWhatsappType>(
        'NumerosWhatsapp',
        NumerosWhatsappSchema,
        'NumerosWhatsapp',
    );

export default NumerosWhatsapp;
