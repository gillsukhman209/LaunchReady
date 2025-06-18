import OpenAI from "openai";

let api_key =
  "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";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: api_key,
});

export default openai;
