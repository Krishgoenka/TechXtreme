import mongoose from "mongoose";

const AudienceSchema = new mongoose.Schema({
  name: String,
  batchId: String,
  email: String,
  phone: String,
});

export default mongoose.models.Audience ||
  mongoose.model("Barati", AudienceSchema);
