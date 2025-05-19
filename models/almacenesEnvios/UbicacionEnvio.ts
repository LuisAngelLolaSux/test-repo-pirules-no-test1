import mongoose, { Schema, Model } from 'mongoose';
import { UbicacionEnvioType } from '@/typings/types';

const UbicacionEnvioSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // referencia al usuario
        pais: { type: String, required: true }, // Country of the location
        estados: [{ type: String, required: true }], // listas de los estados
        tiposEnvio: [{ type: Schema.Types.ObjectId, ref: 'TipoEnvio', default: null }], // metodos de envio asosciados
    },
    { timestamps: true },
);

const UbicacionEnvio: Model<UbicacionEnvioType> =
    mongoose.models.UbicacionEnvio ||
    mongoose.model<UbicacionEnvioType>('UbicacionEnvio', UbicacionEnvioSchema, 'UbicacionEnvio');

export default UbicacionEnvio;
