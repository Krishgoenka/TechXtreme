import mongoose from "mongoose";

const IdeathonSchema = new mongoose.Schema({
  name: String,
  email: String,
  batchId: String,
  teamName: String,
  projectTitle: String,
  description: String,
});

export default mongoose.models.Ideathon ||
  mongoose.model("Ideathon", IdeathonSchema);
