import mongoose, { Model, Schema } from 'mongoose';
import { LastDashboardType } from '@/typings/types';

const LastDashboardSchema = new mongoose.Schema(
    {
        pedidos: {
            type: Number,
            default: 0,
        },
        activeProducts: {
            type: Number,
            default: 0,
        },
        activeAgent: {
            type: Number,
            default: 0,
        },
        totalConversations: {
            type: Number,
            default: 0,
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    },
    { timestamps: true },
);

// Creamos el modelo
const LastDashboard: Model<LastDashboardType> =
    mongoose.models.LastDashboard ||
    mongoose.model<LastDashboardType>('LastDashboard', LastDashboardSchema, 'LastDashboard');

export default LastDashboard;
