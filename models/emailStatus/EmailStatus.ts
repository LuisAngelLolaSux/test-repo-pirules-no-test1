import mongoose, { Model, Schema } from 'mongoose';
import { EmailStatusType } from '@/typings/types';

const EmailStatusSchema = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        emailService: [
            {
                serviceName: { type: String, required: false },
                lastSent: { type: Date, required: false },
            },
        ],
    },
    { timestamps: true },
);

const EmailStatus: Model<EmailStatusType> =
    mongoose.models.EmailStatus ||
    mongoose.model<EmailStatusType>('EmailStatus', EmailStatusSchema, 'EmailStatus');

export default EmailStatus;
