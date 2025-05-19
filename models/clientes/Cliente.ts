import { ClienteType } from '@/typings/types';
import mongoose, { Model, Schema } from 'mongoose';

// Esquema de Cliente
const DireccionSchema = new mongoose.Schema({
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    estado: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    numeroExterior: { type: String, required: true },
    numeroInterior: { type: String, default: null },
    datosAdicionales: { type: String, default: null },
});

const ClienteSchema = new mongoose.Schema(
    {
        apellidos: { type: String, required: true },
        nombre: { type: String, required: true },
        correo: { type: String, required: true },
        telefono: { type: String, default: null },
        empresa: { type: String, default: null },
        tipo: { type: String, default: 'General' },
        calificacion: { type: Number, default: 5 },
        direcciones: { type: [DireccionSchema], default: [] },
        direccionesFacturacion: { type: [DireccionSchema], default: [] },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        eliminado: { type: Boolean, default: false },
    },
    { timestamps: true },
);

// Crear el modelo
const Cliente: Model<ClienteType> =
    mongoose.models.Cliente || mongoose.model<ClienteType>('Cliente', ClienteSchema, 'Clientes');

export default Cliente;
