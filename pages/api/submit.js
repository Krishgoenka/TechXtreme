import { connectToDatabase } from "../../lib/mongodb";
import Audience from "../../models/Audience";
import Cultural from "../../models/Cultural";
import GenAI from "../../models/GenAI";
import Ideathon from "../../models/Ideathon";

import Cors from "nextjs-cors";

export default async function handler(req, res) {
  await Cors(req, res, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    await connectToDatabase();
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
