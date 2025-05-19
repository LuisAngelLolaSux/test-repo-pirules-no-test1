import mongoose, { Schema } from 'mongoose';

const TwoFactorTokenSchema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
});

TwoFactorTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const TwoFactorToken =
    mongoose.models.TwoFactorToken ||
    mongoose.model('TwoFactorToken', TwoFactorTokenSchema, 'TwoFactorToken');

export default TwoFactorToken;
