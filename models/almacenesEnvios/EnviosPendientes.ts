import mongoose, { Schema, Model } from 'mongoose';
import { EnviosPendientesType } from '@/typings/types';

const EnviosPendientesSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        fecha: { type: String, required: true },
        paquetes: { type: Number, default: 0 },
        estado: { type: Boolean, default: false },
    },
    { timestamps: true },
);

const EnviosPendientesAmPm: Model<EnviosPendientesType> =
    mongoose.models.EnviosPendientesAmPm ||
    mongoose.model<EnviosPendientesType>(
        'EnviosPendientesAmPm',
        EnviosPendientesSchema,
        'EnviosPendientesAmPm',
    );

export default EnviosPendientesAmPm;
