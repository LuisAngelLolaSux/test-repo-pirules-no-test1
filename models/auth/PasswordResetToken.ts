import mongoose, { Schema } from 'mongoose';

const PasswordResetTokenSchema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
});

PasswordResetTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const PasswordResetToken =
    mongoose.models.PasswordResetToken ||
    mongoose.model('PasswordResetToken', PasswordResetTokenSchema, 'PasswordResetToken');

export default PasswordResetToken;
