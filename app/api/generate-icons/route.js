import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import archiver from "archiver";
import { Readable } from "stream";

// iPhone icon sizes and their configurations
const iPhoneIconSizes = [
  {
    size: 20,
    scale: 2,
    filename: "Icon-20@2x.png",
    purpose: "iPhone Notification",
  },
  {
    size: 20,
    scale: 3,
    filename: "Icon-20@3x.png",
    purpose: "iPhone Notification",
  },
  {
    size: 29,
    scale: 2,
    filename: "Icon-29@2x.png",
    purpose: "iPhone Settings",
  },
  {
    size: 29,
    scale: 3,
    filename: "Icon-29@3x.png",
    purpose: "iPhone Settings",
  },
  {
    size: 40,
    scale: 2,
    filename: "Icon-40@2x.png",
    purpose: "iPhone Spotlight",
  },
  {
    size: 40,
    scale: 3,
    filename: "Icon-40@3x.png",
    purpose: "iPhone Spotlight",
  },
  { size: 60, scale: 2, filename: "Icon-60@2x.png", purpose: "iPhone App" },
  { size: 60, scale: 3, filename: "Icon-60@3x.png", purpose: "iPhone App" },
  { size: 1024, scale: 1, filename: "Icon-1024.png", purpose: "App Store" },
];

// Contents.json for AppIcon.appiconset
const contentsJson = {
  images: [
    {
      filename: "Icon-20@2x.png",
      idiom: "iphone",
      scale: "2x",
      size: "20x20",
    },
    {
      filename: "Icon-20@3x.png",
      idiom: "iphone",
      scale: "3x",
      size: "20x20",
    },
    {
      filename: "Icon-29@2x.png",
      idiom: "iphone",
      scale: "2x",
      size: "29x29",
    },
    {
      filename: "Icon-29@3x.png",
      idiom: "iphone",
      scale: "3x",
      size: "29x29",
    },
    {
      filename: "Icon-40@2x.png",
      idiom: "iphone",
      scale: "2x",
      size: "40x40",
    },
    {
      filename: "Icon-40@3x.png",
      idiom: "iphone",
      scale: "3x",
      size: "40x40",
    },
    {
      filename: "Icon-60@2x.png",
      idiom: "iphone",
      scale: "2x",
      size: "60x60",
    },
    {
      filename: "Icon-60@3x.png",
      idiom: "iphone",
      scale: "3x",
      size: "60x60",
    },
    {
      filename: "Icon-1024.png",
      idiom: "ios-marketing",
      scale: "1x",
      size: "1024x1024",
    },
  ],
  info: {
    author: "App Store Connect Helper",
    version: 1,
  },
};

async function processImageToIcon(imageBuffer, size, scale) {
  const targetSize = size * scale;

  try {
    const processedBuffer = await sharp(imageBuffer)
      .resize(targetSize, targetSize, {
        fit: "cover",
        position: "center",
      })
      .png({ quality: 100, compressionLevel: 0 })
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    throw new Error(
      `Failed to process icon size ${targetSize}x${targetSize}: ${error.message}`
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const platforms = JSON.parse(formData.get("platforms") || "[]");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!platforms.includes("iphone")) {
      return NextResponse.json(
        { success: false, error: "iPhone platform must be selected" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const imageBuffer = Buffer.from(bytes);

    // Validate image
    let imageInfo;
    try {
      imageInfo = await sharp(imageBuffer).metadata();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid image file" },
        { status: 400 }
      );
    }

    if (imageInfo.width < 512 || imageInfo.height < 512) {
      return NextResponse.json(
        { success: false, error: "Image must be at least 512x512 pixels" },
        { status: 400 }
      );
    }

    // Generate all iPhone icons
    const iconPromises = iPhoneIconSizes.map(async (iconConfig) => {
      const iconBuffer = await processImageToIcon(
        imageBuffer,
        iconConfig.size,
        iconConfig.scale
      );
      return {
        filename: iconConfig.filename,
        buffer: iconBuffer,
      };
    });

    const icons = await Promise.all(iconPromises);

    // Create ZIP archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Collect chunks properly
    const chunks = [];

    // Set up promise to wait for archive completion
    const archivePromise = new Promise((resolve, reject) => {
      archive.on("data", (chunk) => chunks.push(chunk));
      archive.on("end", () => resolve(Buffer.concat(chunks)));
      archive.on("error", reject);
    });

    // Add icons to archive in proper folder structure
    icons.forEach((icon) => {
      archive.append(icon.buffer, {
        name: `Assets.xcassets/AppIcon.appiconset/${icon.filename}`,
      });
    });

    // Add Contents.json
    archive.append(JSON.stringify(contentsJson, null, 2), {
      name: "Assets.xcassets/AppIcon.appiconset/Contents.json",
    });

    // Add README
    const readme = `# App Icons Generated by App Store Connect Helper

## Included Files:
- AppIcon.appiconset/ - Complete Xcode asset catalog folder
- All required iPhone icon sizes (20px to 1024px)
- Contents.json with proper Xcode configuration

## Usage Instructions:
1. Extract this ZIP file
2. Drag the "Assets.xcassets" folder into your Xcode project
3. Replace your existing AppIcon if prompted
4. Build and run your app!

## Icon Sizes Included:
${iPhoneIconSizes
  .map(
    (icon) =>
      `- ${icon.filename} (${icon.size * icon.scale}x${
        icon.size * icon.scale
      }px) - ${icon.purpose}`
  )
  .join("\n")}

Generated on: ${new Date().toISOString()}
Source: App Store Connect Helper (https://yourapp.com)
`;

    archive.append(readme, { name: "README.md" });

    // Finalize archive and wait for completion
    archive.finalize();
    const zipBuffer = await archivePromise;

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="AppIcons-iPhone-${Date.now()}.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Icon generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate icons" },
      { status: 500 }
    );
  }
}
