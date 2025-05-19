import mongoose, { Model } from 'mongoose';
import { CuentasInstagramType } from '@/typings/types';

const CuentasInstagramSchema = new mongoose.Schema(
    {
        instagramId: { type: String, required: true }, // Id de la cuenta
        nombreInstagram: { type: String, default: null }, // Nombre de la cuenta
        token: { type: String, required: true }, // Token de autenticación del bot
        lastActiveDate: { type: Date, default: null }, // Fecha de la última actividad del celular
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID del usuario/empresa propietario del celular
    },
    { timestamps: true },
);

// Creamos el modelo
const CuentasInstagram: Model<CuentasInstagramType> =
    mongoose.models.CuentasInstagram ||
    mongoose.model<CuentasInstagramType>(
        'CuentasInstagram',
        CuentasInstagramSchema,
        'CuentasInstagram',
    );

export default CuentasInstagram;
