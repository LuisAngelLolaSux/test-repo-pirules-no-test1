import mongoose, { Schema, Model } from 'mongoose';
import { ConfiguracionUsuarioType } from '@/typings/types';

enum Language {
    Español = 'es',
    Ingles = 'en',
    Frances = 'fr',
}

const ConfiguracionUsuarioSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        emailSecundario: { type: String, default: null },
        dispositivos: [
            {
                dispositivo: { type: String, default: null },
                ubicacion: { type: String, default: null },
                ultimo_acceso: { type: Date, default: null },
                estado: { type: Boolean, default: null },
            },
        ],
        idiomaPreferido: { type: String, default: Language.Español },
        zonaHoraria: { type: String, default: null },
        numeroTelefono: { type: String, default: null },
        nombre: { type: String, default: null },
        apellido: { type: String, default: null },
        infoEmpresa: {
            imagenUrl: { type: String, default: null },
            colorEmpresa: {
                type: {
                    principal: { type: String, default: null },
                    secundario: { type: String, default: null },
                    destacado: { type: String, default: null },
                    texto: { type: String, default: null },
                    fondo1: { type: String, default: null },
                    fondo2: { type: String, default: null },
                },
                default: null,
            },
            nombreEmpresa: { type: String, default: null },
            emailEmpresa: { type: String, default: null },
            paginaWeb: { type: String, default: null },
            telefonoEmpresa: { type: String, default: null },
            anoFundacion: { type: Number, default: null },
            industria: { type: String, default: null },
            slogan: { type: String, default: null },
            descripcion: { type: String, default: null },
            redesSociales: [
                {
                    nombre: { type: String, default: null },
                    enlace: { type: String, default: null },
                },
            ],
        },
    },
    { timestamps: true },
);

// Creamos el modelo
const ConfiguracionUsuario: Model<ConfiguracionUsuarioType> =
    mongoose.models.ConfiguracionUsuario ||
    mongoose.model<ConfiguracionUsuarioType>(
        'ConfiguracionUsuario',
        ConfiguracionUsuarioSchema,
        'ConfiguracionUsuario',
    );

export default ConfiguracionUsuario;
