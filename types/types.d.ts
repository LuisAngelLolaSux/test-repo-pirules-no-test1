declare module "tailwindcss-bg-patterns";
export interface ProductoType {
  _id: Types.ObjectId;
  nombre: string;
  descripcion?: string | null;
  img: string[];
  categorias?: string[] | [];
  precio?: number | null;
  porcentajeOferta?: number | null;
  inventario?: number | null;
  sku?: string | null;
  peso?: number | null;
  variantes: Variante[];
  estado: boolean;
  marca?: string | null;
  userId?: Types.ObjectId | null;
}

export interface SubVariante {
  variableType: string;
  variable: string;
  precio: number;
  peso?: number | null;
  sku?: string | null;
  descripcion: string;
  img: string[];
  inventario: number;
}

export interface Variante {
  variableType: string;
  variable: string;
  precio?: number | null;
  peso?: number | null;
  sku?: string | null;
  descripcion?: string | null;
  img: string[];
  inventario?: number | null;
  subVariantes: SubVariante[];
}
