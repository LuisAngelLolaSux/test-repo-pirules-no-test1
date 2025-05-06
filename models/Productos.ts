import mongoose, { Model, Schema } from "mongoose";
import { ProductoType } from "@/types/types";

// Define Schema de subvariante
const subVarianteSchema = new mongoose.Schema({
  variableType: { type: String, required: true }, // Por ejemplo: 'color', 'material'
  variable: { type: String, required: true }, // Valor de la variable, ej: 'red', 'cotton'
  precio: { type: Number, required: true },
  peso: {
    type: Number,
    default: null,
  },
  sku: { type: String, default: null, unique: true },
  descripcion: { type: String, required: true },
  img: {
    type: [String],
    default: [],
  },
  inventario: { type: Number, required: true },
});

const varianteSchema = new mongoose.Schema({
  variableType: { type: String, required: true }, // Tipo de variable: 'tamaño', 'color', etc.
  variable: { type: String, required: true }, // Valor de la variable: ej. 'sm', 'md', 'lg'
  precio: { type: Number, default: null },
  peso: {
    type: Number,
    default: null,
  },
  sku: { type: String, default: null, unique: true },
  descripcion: { type: String, default: null },
  img: {
    type: [String],
    default: [],
  },
  inventario: { type: Number, default: null },
  subVariantes: {
    type: [subVarianteSchema],
    default: [],
  },
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
      default: null,
    },
    img: {
      type: [String],
      default: [],
    },
    categoria: {
      type: String, // Categoria del producto tenemos que crear un array de objectType de mongoose con referencia a modelo categorias que todavia no esta echo
      default: null,
    },
    precio: {
      type: Number,
      default: null,
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
      unique: true,
    },
    peso: {
      type: Number,
      default: null,
    },
    slug: {
      type: String,
      default: null,
      unique: true,
    },
    variantes: {
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
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
); //para crear el campo de fecha de creación y modificación

// Creamos el modelo
const Producto: Model<ProductoType> =
  mongoose.models.Producto || mongoose.model<ProductoType>("Producto", productoSchema, "Producto");

export default Producto;
