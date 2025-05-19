import mongoose, { Schema } from 'mongoose';
import { env } from 'process';

const userRoleEnum = ['ADMIN', 'USER', 'DEV', 'TESTER', 'USER_MANAGER', 'USER_MARKETING'];
const enviosEnum = ['Manual', 'Automatico'];
const UserSchema = new Schema(
    {
        name: { type: String, required: false },
        email: { type: String, unique: true, required: false },
        emailVerified: { type: Date, required: false },
        image: { type: String, required: false },
        password: { type: String, required: false },
        role: { type: String, enum: userRoleEnum, default: 'USER' },
        accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
        isTwoFactorEnabled: { type: Boolean, default: false },
        stripeAccountId: { type: String, required: false },
        stripeCustomerId: { type: String, required: false },
        ofreceEnvios: { type: String, enum: enviosEnum, default: null },
        twoFactorConfirmation: {
            type: Schema.Types.ObjectId,
            ref: 'TwoFactorConfirmation',
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        companyDetails: {
            type: {
                name: String,
                website: String,
                foundationYear: Number,
                industry: String,
            },
            default: null,
        },
        lolaCredits: { type: Number, default: 100 }, // 100 pesos de regalo a clientes nuevos
    },
    { timestamps: true },
);

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'User');

export default User;
