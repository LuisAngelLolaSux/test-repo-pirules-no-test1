import mongoose, { Schema, Model } from 'mongoose';
import { TipoEnvioType } from '@/typings/types';

const TipoEnvioSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, //de que user son
        nombreEnvio: { type: String, default: null }, //nombre asignado al envio
        precioEnvio: { type: String, default: null },
        diasEstimadosEntrega: { type: String, default: null },
    },
    { timestamps: true },
);

const TipoEnvio: Model<TipoEnvioType> =
    mongoose.models.TipoEnvio ||
    mongoose.model<TipoEnvioType>('TipoEnvio', TipoEnvioSchema, 'TipoEnvio');

export default TipoEnvio;
