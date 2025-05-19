import mongoose, { Model } from 'mongoose';
import { BotPauseType } from '@/typings/types';

const BotPauseSchema = new mongoose.Schema(
    {
        botId: { type: mongoose.Schema.Types.ObjectId, ref: 'BotConfig', required: true }, // Id del bot
        pauseUntil: { type: Date, default: null }, // Fecha de la última actividad del celular
        phone: { type: String, default: null },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID del usuario/empresa propietario del celular
    },
    { timestamps: true },
);

// Creamos el modelo
const BotPause: Model<BotPauseType> =
    mongoose.models.BotPause ||
    mongoose.model<BotPauseType>('BotPause', BotPauseSchema, 'BotPause');

export default BotPause;
