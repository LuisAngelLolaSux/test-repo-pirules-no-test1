import mongoose, { Model } from 'mongoose';
import { TemplateLimitType } from '@/typings/types';

const TemplateLimitSchema = new mongoose.Schema(
    {
        currentDate: { type: Date, required: true }, // Fecha para donde se enviaron
        sentToday: { type: Number, default: 0 },
        phoneMetaId: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID del usuario/empresa
    },
    { timestamps: true },
);

// Creamos el modelo
const TemplateLimit: Model<TemplateLimitType> =
    mongoose.models.TemplateLimit ||
    mongoose.model<TemplateLimitType>('TemplateLimit', TemplateLimitSchema, 'TemplateLimit');

export default TemplateLimit;
