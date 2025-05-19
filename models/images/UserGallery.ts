import mongoose, { Model } from 'mongoose';
import { UserGalleryType } from '@/typings/types';

const UserGallerySchema = new mongoose.Schema(
    {
        images: { type: [String], default: [] },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true },
);

// Creamos el modelo
const UserGallery: Model<UserGalleryType> =
    mongoose.models.UserGallery ||
    mongoose.model<UserGalleryType>('UserGallery', UserGallerySchema, 'UserGallery');

export default UserGallery;
