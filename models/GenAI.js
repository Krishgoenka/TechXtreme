import mongoose from "mongoose";

const GenAISchema = new mongoose.Schema({
  name: String,
  email: String,
  batch: String,
  id: String,
  cloudUrl: String,
  tshirtSize: String,
});

export default mongoose.models.GenAI || mongoose.model("GenAI", GenAISchema);
