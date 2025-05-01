import mongoose, { Schema, Document, Model } from "mongoose";
import { ModularPageConfig } from "../typings/types";

const PageConfigSchema: Schema = new Schema({
  globalValues: {
    colores: {
      primary: { type: String, required: true },
      secondary: { type: String, required: true },
      text: { type: String, required: true },
    },
    companyName: { type: String, required: false, default: "Default Company" },
  },
  layout: {
    header: { componentes: { type: Array, default: [] } },
    leftSidebar: { componentes: { type: Array, default: [] } },
    rightSidebar: { componentes: { type: Array, default: [] } },
    footer: { componentes: { type: Array, default: [] } },
  },
  paginas: { type: Array, default: [] },
});

const PageConfig: Model<ModularPageConfig & Document> =
  mongoose.models.PageConfig ||
  mongoose.model<ModularPageConfig & Document>("PageConfig", PageConfigSchema);

export default PageConfig;
