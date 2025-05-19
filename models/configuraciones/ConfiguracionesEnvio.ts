import mongoose, { Schema, Model } from 'mongoose';
import { ConfiguracionEnvioType } from '@/typings/types';

const ConfiguracionEnvioSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        ofreceEnvios: { type: Boolean, default: false },
        tipoDeEnvio: { type: String, enum: ['Automatico', 'Manual'], default: 'Automatico' },
    },
    { timestamps: true },
);

const ConfiguracionEnvio: Model<ConfiguracionEnvioType> =
    mongoose.models.ConfiguracionEnvio ||
    mongoose.model<ConfiguracionEnvioType>(
        'ConfiguracionEnvio',
        ConfiguracionEnvioSchema,
        'ConfiguracionEnvio',
    );

export default ConfiguracionEnvio;
