import OpenAI from "openai";
import dotenv from "dotenv";

// not working , will update later
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.QQ,
});
export const chatbot = async (req, res) => {
  try {
    const pp = req.params.pp;
    const myprompt =
      " question " + pp + "pleI dont Know" + "the question is : "; //

    const prompt = req.params.prompt;
    const prompt1 = myprompt + prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [{ role: "user", content: prompt1 }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
