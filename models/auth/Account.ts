import mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: { type: String, required: true },
        provider: { type: String, required: true },
        providerAccountId: {
            type: String,
            required: true,
            unique: true,
        },
        refresh_token: { type: String, required: false },
        access_token: { type: String, required: false },
        expires_at: { type: Number, required: false },
        token_type: { type: String, required: false },
        scope: { type: String, required: false },
        id_token: { type: String, required: false },
        session_state: { type: String, required: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account = mongoose.models.Account || mongoose.model('Account', AccountSchema, 'Account');

export default Account;
