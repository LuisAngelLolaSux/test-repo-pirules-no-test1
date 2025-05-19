import mongoose, { Model, Schema } from 'mongoose';
import { CodigoErrorType } from '@/typings/types';

const codigoErrorSchema = new mongoose.Schema(
    {
        codigo: {
            type: Number,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        sugerencias: {
            type: String,
            default: null,
        },
        marca: {
            type: String,
            default: null,
        },
        modelo: {
            type: String,
            default: null,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true },
);

// Creamos el modelo
const CodigoError: Model<CodigoErrorType> =
    mongoose.models.CodigoError ||
    mongoose.model<CodigoErrorType>('CodigoError', codigoErrorSchema, 'CodigoError');

export default CodigoError;
