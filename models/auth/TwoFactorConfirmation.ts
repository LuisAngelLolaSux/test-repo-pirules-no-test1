import mongoose, { Schema } from 'mongoose';

const TwoFactorConfirmationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
});

TwoFactorConfirmationSchema.index({ userId: 1 }, { unique: true });

const TwoFactorConfirmation =
    mongoose.models.TwoFactorConfirmation ||
    mongoose.model('TwoFactorConfirmation', TwoFactorConfirmationSchema, 'TwoFactorConfirmation');

export default TwoFactorConfirmation;
