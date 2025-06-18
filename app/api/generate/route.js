import { NextResponse } from "next/server";
import openai from "../../../lib/openai.js";
import {
  createAppStorePrompt,
  validateResponse,
} from "../../../lib/prompts.js";

export async function POST(request) {
  try {
    // Parse request body
    const { appName, appDescription } = await request.json();

    // Validate input
    if (!appName || !appDescription) {
      return NextResponse.json(
        { error: "App name and description are required" },
        { status: 400 }
      );
    }

    if (appName.length > 50) {
      return NextResponse.json(
        { error: "App name must be 50 characters or less" },
        { status: 400 }
      );
    }

    if (appDescription.length > 500) {
      return NextResponse.json(
        { error: "App description must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Create prompt
    const prompt = createAppStorePrompt(appName.trim(), appDescription.trim());

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert App Store optimization specialist. Always respond with valid JSON only, no markdown formatting or extra text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Parse response
    const aiResponse = completion.choices[0].message.content;
    console.log("Raw AI Response:", aiResponse);

    // Try to parse JSON response
    let parsedResponse;
    try {
      // Clean the response - sometimes AI wraps JSON in markdown code blocks
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response that failed to parse:", aiResponse);
      throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
    }

    // Validate the response structure and character limits
    const validatedResponse = validateResponse(parsedResponse);

    return NextResponse.json({
      success: true,
      data: validatedResponse,
    });
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Handle specific OpenAI errors
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      );
    }

    if (error.code === "invalid_api_key") {
      return NextResponse.json(
        { error: "Invalid API configuration." },
        { status: 500 }
      );
    }

    // General error response
    return NextResponse.json(
      { error: "Failed to generate metadata. Please try again." },
      { status: 500 }
    );
  }
}
