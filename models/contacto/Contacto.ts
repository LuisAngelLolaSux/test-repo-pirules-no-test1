import mongoose, { Model, Schema } from 'mongoose';
import { ContactoType } from '@/typings/types';

const ContactoSchema = new mongoose.Schema(
    {
        descripcion: { type: String, required: true },
        email: { type: String, required: true },
        empresa: { type: String, required: true },
        mejora: { type: String, required: true },
        presupuesto: { type: String, required: true },
    },
    { timestamps: true },
);

const Contacto: Model<ContactoType> =
    mongoose.models.EmailStatus ||
    mongoose.model<ContactoType>('Contacto', ContactoSchema, 'Contacto');

export default Contacto;
