import { connectToDatabase } from "../../lib/mongodb";
import Audience from "../../models/Audience";
import Cultural from "../../models/Cultural";
import GenAI from "../../models/GenAI";
import Ideathon from "../../models/Ideathon";

export default async function handler(req, res) {
  // Allow requests from a specific origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end(); // ✅ Use `res.status().end()` instead of `return res.status().end();`
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    await connectToDatabase(); // Ensure DB connection

    const { formType, ...formData } = req.body;
    let Model;

    switch (formType) {
      case "ideathon":
        Model = Ideathon;
        break;
      case "genai":
        Model = GenAI;
        break;
      case "cultural":
        Model = Cultural;
        break;
      case "audience":
        Model = Audience;
        break;
      default:
        res.status(400).json({ message: "Invalid form type" });
        return;
    }

    const newEntry = new Model(formData);
    await newEntry.save();

    res
      .status(201)
      .json({ message: `Form ${formType} submitted successfully!` });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
