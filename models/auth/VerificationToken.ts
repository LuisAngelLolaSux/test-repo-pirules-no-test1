import mongoose, { Schema } from 'mongoose';

const VerificationTokenSchema = new Schema({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
});

VerificationTokenSchema.index({ email: 1, token: 1 }, { unique: true });

const VerificationToken =
    mongoose.models.VerificationToken ||
    mongoose.model('VerificationToken', VerificationTokenSchema, 'VerificationToken');

export default VerificationToken;
