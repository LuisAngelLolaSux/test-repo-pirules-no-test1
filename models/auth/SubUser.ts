import mongoose, { Schema } from "mongoose";

const userRoleEnum = ["ADMIN", "USER", "DEV", "TESTER", "USER_MANAGER", "USER_MARKETING"];

const SubUserSchema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, unique: true, required: false },
    emailVerified: { type: Date, required: false },
    password: { type: String, required: false },
    lolaParentId: { type: String, required: false },
    role: { type: String, enum: userRoleEnum, default: "USER" },
    customerStripeId: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SubUser = mongoose.models.SubUser || mongoose.model("SubUser", SubUserSchema, "SubUser");

export default SubUser;
