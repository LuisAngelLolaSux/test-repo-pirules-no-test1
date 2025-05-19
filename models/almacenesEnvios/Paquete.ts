import mongoose, { Schema, Model } from 'mongoose';
import { PaqueteType } from '@/typings/types';

const DimensionesSchema = new Schema({
    largo: { type: Number, required: true }, // Largo del paquete en cm
    ancho: { type: Number, required: true }, // Ancho del paquete en cm
    alto: { type: Number, required: true }, // Alto del paquete en cm
});

const PaqueteSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        nombre: { type: String, required: true }, // Nombre del paquete
        dimensiones: { type: DimensionesSchema, required: true },
        pesoInicial: { type: Number, required: true }, // Peso inicial del paquete en kg
    },
    { timestamps: true },
);

const Paquete: Model<PaqueteType> =
    mongoose.models.Paquete || mongoose.model<PaqueteType>('Paquete', PaqueteSchema, 'Paquete');

export default Paquete;
