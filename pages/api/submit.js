import { connectToDatabase } from "../../lib/mongodb";
import Audience from "../../models/Audience";
import Cultural from "../../models/Cultural";
import GenAI from "../../models/GenAI";
import Ideathon from "../../models/Ideathon";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (*)
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
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
        return res.status(400).json({ message: "Invalid form type" });
    }

    const newEntry = new Model(formData);
    await newEntry.save();

    return res
      .status(201)
      .json({ message: `Form ${formType} submitted successfully!` });
  } catch (error) {
    console.error("Error submitting form:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
