import { NextResponse } from "next/server";
import openai from "../../../lib/openai.js";

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

    if (appName.length > 100) {
      return NextResponse.json(
        { error: "App name must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (appDescription.length > 500) {
      return NextResponse.json(
        { error: "App description must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Create optimized prompt for app logo
    const prompt = `Create a modern, minimalist app icon logo for "${appName.trim()}". 
    
App Description: ${appDescription.trim()}

Design Requirements:
- Clean, modern, professional app icon style
- Simple geometric shapes or symbols
- Bold, recognizable design that works at small sizes
- Suitable for iOS/Android app stores
- No text or words in the logo
- High contrast colors
- Minimalist design that clearly represents the app's purpose
- Should work well on both light and dark backgrounds
- Professional, trustworthy appearance
- Vector-style illustration suitable for app icons

Style: Modern minimalist app icon, clean geometric design, professional`;

    // Call OpenAI DALL-E 3 API
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural", // Natural style is better for logos
      response_format: "url",
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    return NextResponse.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        originalPrompt: prompt,
        revisedPrompt: revisedPrompt,
        appName: appName.trim(),
        appDescription: appDescription.trim(),
      },
    });
  } catch (error) {
    console.error("Error generating logo:", error);

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

    if (error.code === "content_policy_violation") {
      return NextResponse.json(
        {
          error:
            "Content violates OpenAI's usage policies. Please try a different description.",
        },
        { status: 400 }
      );
    }

    // General error response
    return NextResponse.json(
      { error: "Failed to generate logo. Please try again." },
      { status: 500 }
    );
  }
}
