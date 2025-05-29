import mongoose, { Schema, Model } from "mongoose";

const BlogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: [String], default: [] }, // Array de strings para los textos
    category: { type: String, required: true },
    image: { type: String, default: null }, // Opcional: imagen principal del blog
  },
  { timestamps: true }
);

const Blog: Model<any> = mongoose.models.Blog || mongoose.model("Blog", BlogSchema, "Blogs");

export default Blog;
