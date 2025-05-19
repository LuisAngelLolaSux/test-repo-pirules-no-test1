import { BotConfigType } from '@/typings/types';
import mongoose, { Model, Schema } from 'mongoose';

const botConfigSchema = new mongoose.Schema(
    {
        profilePhoto: {
            type: String,
            default: null,
        },
        agentName: {
            type: String,
            required: true,
        },
        website: {
            type: String,
            default: null,
        },
        context: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        warranties: {
            type: [String],
            default: [],
        },
        faqs: {
            type: String,
            required: true,
        },
        contacts: {
            type: [
                {
                    role: String,
                    name: String,
                    number: String,
                    mail: String,
                },
            ],
            required: true,
        },
        calendar: {
            type: Boolean,
            default: false,
        },
        calendarDetails: {
            type: {
                description: String,
                availableTimes: [
                    {
                        date: String,
                        time: String,
                    },
                ],
            },
            default: null,
        },
        others: {
            type: String,
            default: null,
        },
        files: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    content: [
                        {
                            info: {
                                type: String,
                                required: true,
                            },
                            embeddings: [
                                {
                                    type: Number,
                                    required: true,
                                },
                            ],
                        },
                    ],
                },
            ],
            default: [],
        },
        links: {
            type: [
                {
                    link: String,
                    description: String,
                },
            ],
            default: [],
        },
        messageSize: {
            type: String,
            default: 'short',
        },
        model: { type: String, default: 'gpt-4o-mini' },
        numero: { type: String, default: '1234' },
        identificadorWhatsapp: { type: String, default: null },
        instagramId: { type: String, default: '1234' },
        identificadorInstagram: { type: String, default: null },
        userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        crearLinks: { type: Boolean, default: false }, // Crear links de pago
        crearOrdenes: { type: Boolean, default: false }, // Crear links para ordenes
        mostrarProductos: { type: Boolean, default: false },
        eliminado: { type: Boolean, default: false },
        numberOfChats: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const BotConfig: Model<BotConfigType> =
    mongoose.models.BotConfig ||
    mongoose.model<BotConfigType>('BotConfig', botConfigSchema, 'BotConfig');

export default BotConfig;
