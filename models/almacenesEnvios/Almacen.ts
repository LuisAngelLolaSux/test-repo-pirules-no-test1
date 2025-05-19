import mongoose, { Schema, Model } from 'mongoose';
import { AlmacenType } from '@/typings/types';

const HorarioDiaSchema = new Schema(
    {
        inicio: { type: String, required: true },
        fin: { type: String, required: true },
    },
    { _id: false }, // previene el _id de hacerse en subdocumentos
);

const HorarioSchema = new Schema(
    {
        lunes: { type: HorarioDiaSchema, default: null },
        martes: { type: HorarioDiaSchema, default: null },
        miercoles: { type: HorarioDiaSchema, default: null },
        jueves: { type: HorarioDiaSchema, default: null },
        viernes: { type: HorarioDiaSchema, default: null },
        sabado: { type: HorarioDiaSchema, default: null },
        domingo: { type: HorarioDiaSchema, default: null },
    },
    { _id: false }, // previene el _id de hacerse en subdocumentos
);

const AddressSchema = new Schema({
    calle: { type: String, required: true },
    colonia: { type: String, required: true },
    numeroInt: { type: String, default: null },
    numeroExt: { type: String, equired: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true },
    estado: { type: String, required: true },
    ciudad: { type: String, required: true },
});

const ContactoSchema = new Schema({
    telefono: { type: String, required: true },
    correo: { type: String, required: true },
    nombreDespachador: { type: String, required: true }, // Persona o empresa
});

const AlmacenSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        nombre: { type: String, required: true },
        direccion: { type: AddressSchema, required: true },
        contacto: { type: ContactoSchema, required: true },
        horario: { type: HorarioSchema, required: true },
        productosDisponibles: { type: Number, default: null },
        ofreceRetiros: { type: Boolean, default: null },
        estadoActivo: { type: Boolean, required: true },
    },
    { timestamps: true },
);

const Almacen: Model<AlmacenType> =
    mongoose.models.Almacen || mongoose.model<AlmacenType>('Almacen', AlmacenSchema, 'Almacen');

export default Almacen;
