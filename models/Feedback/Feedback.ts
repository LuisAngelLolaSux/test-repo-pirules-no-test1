import mongoose, { Model } from 'mongoose';
import { FeedbackType } from '@/typings/types';

const FeedbackSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true },
        contenido: { type: String, required: true },
    },
    { timestamps: true },
);

// Creamos el modelo
const Feedback: Model<FeedbackType> =
    mongoose.models.Feedback ||
    mongoose.model<FeedbackType>('Feedback', FeedbackSchema, 'Feedback');

export default Feedback;
