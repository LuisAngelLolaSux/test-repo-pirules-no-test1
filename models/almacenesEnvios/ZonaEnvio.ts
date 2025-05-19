import mongoose, { Schema, Model } from 'mongoose';
import { ZonaEnvioType } from '@/typings/types';
import TipoEnvio from './TipoEnvio';

const ZonaEnvioSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        estados: [{ type: String, required: true }], // List of state names
        tiposEnvio: [{ type: Schema.Types.ObjectId, ref: 'TipoEnvio', default: null }], // Tipos de envío para la ubicación completa
    },
    { timestamps: true },
);

const ZonaEnvio: Model<ZonaEnvioType> =
    mongoose.models.ZonaEnvio ||
    mongoose.model<ZonaEnvioType>('ZonaEnvio', ZonaEnvioSchema, 'ZonaEnvio');

export default ZonaEnvio;
