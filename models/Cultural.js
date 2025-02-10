import mongoose from "mongoose";

const CulturalSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  event: String,
  customEvent: String,
  participants: String,
  duration: String,
});

export default mongoose.models.Cultural ||
  mongoose.model("Engagement", CulturalSchema);
