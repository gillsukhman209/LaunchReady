export function createAppStorePrompt(appName, appDescription) {
  return `You are an elite App Store Optimization (ASO) expert with deep knowledge of Apple’s App Store ranking algorithm, keyword indexing, and metadata optimization strategies.

Your job is to generate **highly optimized App Store metadata** that improves **search discoverability** and **conversion rates** for the following app:

App Name: "${appName}"  
App Description: "${appDescription}"

---

🔁 **Output ONLY the following JSON structure (no extra text):**
{
  "appName": "optimized app name (max 30 characters)",
  "subtitle": "compelling subtitle (max 30 characters)",
  "category": "most appropriate App Store category",
  "promotionalText": "engaging promotional text (max 170 characters)",
  "description": "full compelling description (400-1000 characters)"
}

---

🚨 **Strict Requirements:**
- All fields must be within their specified character limits (truncate if needed).
- Prioritize **high-traffic, relevant keywords** in appName, subtitle, and description — but use them **naturally** (avoid keyword stuffing).
- **appName**: Short, brandable, and includes a top-performing keyword.
- **subtitle**: Sharp value prop or feature-based hook (improves click-through).
- **category**: Must match official App Store categories (e.g., Health & Fitness, Productivity, Utilities).
- **promotionalText**: Feature-driven hook that emphasizes benefit or urgency (no fluff).
- **description**: Persuasive copy that informs, excites, and convinces. Use short paragraphs, strong verbs, and benefit-focused language. Include subtle keyword repetition.

---

🏆 **ASO Strategy Guidelines:**
- Think like a growth marketer and ASO specialist.
- Prioritize discoverability and conversion over creativity.
- Write in a clear, natural tone — avoid sounding robotic or overly generic.
- No emojis, markdown, or extra formatting.
- Output **ONLY** the raw JSON object.`;
}

export function validateResponse(response) {
  // Basic validation for required fields
  const required = [
    "appName",
    "subtitle",
    "category",
    "promotionalText",
    "description",
  ];

  for (const field of required) {
    if (!response[field] || typeof response[field] !== "string") {
      throw new Error(`Missing or invalid field: ${field}`);
    }
  }

  // Character limit validation
  if (response.appName.length > 30) {
    throw new Error("App name exceeds 30 characters");
  }

  if (response.subtitle.length > 30) {
    throw new Error("Subtitle exceeds 30 characters");
  }

  if (response.promotionalText.length > 170) {
    throw new Error("Promotional text exceeds 170 characters");
  }

  if (response.description.length < 400 || response.description.length > 1000) {
    throw new Error("Description must be between 400-1000 characters");
  }

  return response;
}
