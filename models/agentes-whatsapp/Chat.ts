import { ChatType } from '@/typings/types';
import mongoose, { Model, Schema } from 'mongoose';

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: true,
    },
    bot: {
        type: Schema.Types.ObjectId,
        ref: 'BotConfig',
        required: true,
    },
    chatStartDate: {
        type: Date,
        default: Date.now,
    },
    messages: [
        {
            role: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            created: {
                type: Date,
                default: Date.now,
            },
            tool_call_id: String,
            name: String,
            tool_calls: [
                {
                    id: String,
                    type: {
                        type: String,
                    },
                    function: {
                        name: String,
                        arguments: String,
                    },
                },
            ],
        },
    ],
});

const Chat: Model<ChatType> =
    mongoose.models.Chat || mongoose.model<ChatType>('Chat', chatSchema, 'Chat');

export default Chat;
