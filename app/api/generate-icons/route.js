import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import archiver from "archiver";
import { Readable } from "stream";

// Icon configurations for all platforms
const iconConfigurations = {
  iphone: [
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
  ],
  ipad: [
    {
      size: 20,
      scale: 1,
      filename: "Icon-20.png",
      purpose: "iPad Notification",
    },
    {
      size: 20,
      scale: 2,
      filename: "Icon-20@2x.png",
      purpose: "iPad Notification",
    },
    { size: 29, scale: 1, filename: "Icon-29.png", purpose: "iPad Settings" },
    {
      size: 29,
      scale: 2,
      filename: "Icon-29@2x.png",
      purpose: "iPad Settings",
    },
    { size: 40, scale: 1, filename: "Icon-40.png", purpose: "iPad Spotlight" },
    {
      size: 40,
      scale: 2,
      filename: "Icon-40@2x.png",
      purpose: "iPad Spotlight",
    },
    { size: 76, scale: 1, filename: "Icon-76.png", purpose: "iPad App" },
    { size: 76, scale: 2, filename: "Icon-76@2x.png", purpose: "iPad App" },
    {
      size: 83.5,
      scale: 2,
      filename: "Icon-83.5@2x.png",
      purpose: "iPad Pro App",
    },
    { size: 1024, scale: 1, filename: "Icon-1024.png", purpose: "App Store" },
  ],
  watchos: [
    {
      size: 24,
      scale: 2,
      filename: "Icon-24@2x.png",
      purpose: "Watch Notification (38mm)",
    },
    {
      size: 27.5,
      scale: 2,
      filename: "Icon-27.5@2x.png",
      purpose: "Watch Notification (42mm)",
    },
    {
      size: 29,
      scale: 2,
      filename: "Icon-29@2x.png",
      purpose: "Watch Companion Settings",
    },
    {
      size: 29,
      scale: 3,
      filename: "Icon-29@3x.png",
      purpose: "Watch Companion Settings",
    },
    {
      size: 40,
      scale: 2,
      filename: "Icon-40@2x.png",
      purpose: "Watch App (38mm)",
    },
    {
      size: 44,
      scale: 2,
      filename: "Icon-44@2x.png",
      purpose: "Watch App (40mm)",
    },
    {
      size: 50,
      scale: 2,
      filename: "Icon-50@2x.png",
      purpose: "Watch App (44mm)",
    },
    {
      size: 86,
      scale: 2,
      filename: "Icon-86@2x.png",
      purpose: "Watch Quick Look (38mm)",
    },
    {
      size: 98,
      scale: 2,
      filename: "Icon-98@2x.png",
      purpose: "Watch Quick Look (42mm)",
    },
    {
      size: 108,
      scale: 2,
      filename: "Icon-108@2x.png",
      purpose: "Watch Quick Look (44mm)",
    },
    {
      size: 1024,
      scale: 1,
      filename: "Icon-1024.png",
      purpose: "Watch Marketing",
    },
  ],
  macos: [
    { size: 16, scale: 1, filename: "Icon-16.png", purpose: "Mac" },
    { size: 16, scale: 2, filename: "Icon-16@2x.png", purpose: "Mac" },
    { size: 32, scale: 1, filename: "Icon-32.png", purpose: "Mac" },
    { size: 32, scale: 2, filename: "Icon-32@2x.png", purpose: "Mac" },
    { size: 128, scale: 1, filename: "Icon-128.png", purpose: "Mac" },
    { size: 128, scale: 2, filename: "Icon-128@2x.png", purpose: "Mac" },
    { size: 256, scale: 1, filename: "Icon-256.png", purpose: "Mac" },
    { size: 256, scale: 2, filename: "Icon-256@2x.png", purpose: "Mac" },
    { size: 512, scale: 1, filename: "Icon-512.png", purpose: "Mac" },
    { size: 512, scale: 2, filename: "Icon-512@2x.png", purpose: "Mac" },
  ],
};

// Generate Contents.json entries for each platform
function generateContentsJson(selectedPlatforms) {
  const images = [];

  selectedPlatforms.forEach((platform) => {
    const configs = iconConfigurations[platform];

    configs.forEach((config) => {
      let entry = {
        filename: config.filename,
        scale: `${config.scale}x`,
        size: `${config.size}x${config.size}`,
      };

      // Set idiom based on platform
      switch (platform) {
        case "iphone":
          entry.idiom = "iphone";
          break;
        case "ipad":
          entry.idiom = "ipad";
          break;
        case "watchos":
          entry.idiom = "watch";
          if (config.size === 29) {
            entry.role = "companionSettings";
          } else if (config.size === 24 || config.size === 27.5) {
            entry.role = "notificationCenter";
            entry.subtype = config.size === 24 ? "38mm" : "42mm";
          } else if ([40, 44, 50].includes(config.size)) {
            entry.role = "appLauncher";
            if (config.size === 40) entry.subtype = "38mm";
            else if (config.size === 44) entry.subtype = "40mm";
            else if (config.size === 50) entry.subtype = "44mm";
          } else if ([86, 98, 108].includes(config.size)) {
            entry.role = "quickLook";
            if (config.size === 86) entry.subtype = "38mm";
            else if (config.size === 98) entry.subtype = "42mm";
            else if (config.size === 108) entry.subtype = "44mm";
          } else if (config.size === 1024) {
            entry.idiom = "watch-marketing";
            delete entry.role;
          }
          break;
        case "macos":
          entry.idiom = "mac";
          break;
      }

      // Handle special cases for App Store marketing
      if (config.size === 1024 && platform !== "watchos") {
        entry.idiom =
          platform === "iphone" || platform === "ipad"
            ? "ios-marketing"
            : "mac";
      }

      images.push(entry);
    });
  });

  return {
    images,
    info: {
      author: "App Store Connect Helper",
      version: 1,
    },
  };
}

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
    const platforms = JSON.parse(formData.get("platforms") || '["iphone"]');

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (platforms.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one platform must be selected" },
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

    // Generate icons for all selected platforms
    let allIcons = [];
    let platformFolders = [];

    for (const platform of platforms) {
      const configs = iconConfigurations[platform];
      if (!configs) continue;

      // Generate icons for this platform
      const iconPromises = configs.map(async (iconConfig) => {
        const iconBuffer = await processImageToIcon(
          imageBuffer,
          iconConfig.size,
          iconConfig.scale
        );
        return {
          filename: iconConfig.filename,
          buffer: iconBuffer,
          platform: platform,
        };
      });

      const platformIcons = await Promise.all(iconPromises);
      allIcons = allIcons.concat(platformIcons);

      // Determine folder structure
      let folderName;
      switch (platform) {
        case "iphone":
        case "ipad":
          folderName = "iOS";
          break;
        case "watchos":
          folderName = "watchOS";
          break;
        case "macos":
          folderName = "macOS";
          break;
      }

      if (!platformFolders.includes(folderName)) {
        platformFolders.push(folderName);
      }

      // Add icons to archive with proper folder structure
      platformIcons.forEach((icon) => {
        archive.append(icon.buffer, {
          name: `Assets.xcassets/${folderName}/AppIcon.appiconset/${icon.filename}`,
        });
      });
    }

    // Generate and add Contents.json files
    if (platforms.includes("iphone") || platforms.includes("ipad")) {
      const iosPlatforms = platforms.filter(
        (p) => p === "iphone" || p === "ipad"
      );
      const iosContentsJson = generateContentsJson(iosPlatforms);
      archive.append(JSON.stringify(iosContentsJson, null, 2), {
        name: "Assets.xcassets/iOS/AppIcon.appiconset/Contents.json",
      });
    }

    if (platforms.includes("watchos")) {
      const watchContentsJson = generateContentsJson(["watchos"]);
      archive.append(JSON.stringify(watchContentsJson, null, 2), {
        name: "Assets.xcassets/watchOS/AppIcon.appiconset/Contents.json",
      });
    }

    // Generate comprehensive README
    const platformNames = platforms.map((p) =>
      p === "iphone"
        ? "iPhone"
        : p === "ipad"
        ? "iPad"
        : p === "watchos"
        ? "watchOS"
        : "macOS"
    );

    const readme = `# App Icons Generated by App Store Connect Helper

## Platforms Included: ${platformNames.join(", ")}

## Folder Structure:
${platformFolders
  .map((folder) => `- Assets.xcassets/${folder}/AppIcon.appiconset/`)
  .join("\n")}

## Usage Instructions:
1. Extract this ZIP file
2. Drag the "Assets.xcassets" folder into your Xcode project
3. Replace existing AppIcons if prompted
4. Build and run your app!

## Icon Sizes by Platform:

${platforms
  .map((platform) => {
    const configs = iconConfigurations[platform];
    const platformName =
      platform === "iphone"
        ? "iPhone"
        : platform === "ipad"
        ? "iPad"
        : platform === "watchos"
        ? "watchOS"
        : "macOS";

    return `### ${platformName}:
${configs
  .map(
    (icon) =>
      `- ${icon.filename} (${icon.size * icon.scale}x${
        icon.size * icon.scale
      }px) - ${icon.purpose}`
  )
  .join("\n")}`;
  })
  .join("\n\n")}

Generated on: ${new Date().toISOString()}
Source: App Store Connect Helper
`;

    archive.append(readme, { name: "README.md" });

    // Finalize archive and wait for completion
    archive.finalize();
    const zipBuffer = await archivePromise;

    // Generate dynamic filename
    const filename = `AppIcons-${platformNames.join("-")}-${Date.now()}.zip`;

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
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
