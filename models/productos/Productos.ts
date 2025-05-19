import mongoose, { Model, Schema } from 'mongoose';
import { ProductoType } from '@/typings/types';

const varianteSchema = new mongoose.Schema({
    variante: { type: String, required: true },
    subVariante: { type: String, default: null },
    precio: { type: Number, required: true },
    peso: {
        type: Number,
        default: null,
    },
    imagenes: {
        type: [String],
        default: [],
    },
    inventario: { type: Number, required: true },
    sku: { type: String, default: null },
});

// Eschema principal Productos
const productoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        imagenes: {
            type: [String],
            default: [],
        },
        categorias: {
            type: [String],
            default: [],
        },
        precio: {
            type: Number,
            default: null,
        },
        currency: {
            type: String,
            default: 'MXN',
        },
        porcentajeOferta: {
            type: Number,
            default: null,
        },
        inventario: {
            type: Number,
            default: null,
        },
        sku: {
            type: String,
            default: null,
        },
        peso: {
            type: Number,
            default: null,
        },
        largo: {
            type: Number,
            default: null,
        },
        alto: {
            type: Number,
            default: null,
        },
        ancho: {
            type: Number,
            default: null,
        },
        variante: {
            type: {
                nombre: { type: String, required: true },
                opciones: { type: [String], required: true },
            },
            default: null,
        },
        subVariante: {
            type: {
                nombre: { type: String, required: true },
                opciones: { type: [String], required: true },
            },
            default: null,
        },
        variantesCombinadas: {
            type: [varianteSchema],
            default: [],
        },
        estado: {
            type: Boolean,
            default: true,
        },
        marca: {
            type: String,
            default: null,
        },
        tags: {
            type: [String],
            default: [],
        },
        fichaTecnica: {
            type: String,
            default: null,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        eliminado: { type: Boolean, default: false },
        embedding: [
            {
                type: Number,
                required: true,
            },
        ],
    },
    { timestamps: true },
); //para crear el campo de fecha de creación y modificación

// Creamos el modelo
const Producto: Model<ProductoType> =
    mongoose.models.Producto ||
    mongoose.model<ProductoType>('Producto', productoSchema, 'Producto');

export default Producto;
