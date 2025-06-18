// iPhone 15 Pro frame configuration
export const IPHONE_15_PRO_CONFIG = {
  frameWidth: 1024,
  frameHeight: 1536,
  screenArea: {
    x: 92, // Left margin
    y: 156, // Top margin (including Dynamic Island)
    width: 840, // Screen width
    height: 1260, // Screen height
  },
};

// Load image from URL or File
export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      console.log(
        "✅ Image loaded successfully:",
        src instanceof File ? src.name : src
      );
      resolve(img);
    };

    img.onerror = (error) => {
      console.error(
        "❌ Failed to load image:",
        src instanceof File ? src.name : src
      );
      console.error("📋 Error details:", error);
      reject(
        new Error(
          `Failed to load image: ${src instanceof File ? src.name : src}`
        )
      );
    };

    if (src instanceof File) {
      console.log("📁 Loading image from file:", src.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = (error) => {
        console.error("❌ FileReader error:", error);
        reject(new Error(`Failed to read file: ${src.name}`));
      };
      reader.readAsDataURL(src);
    } else {
      console.log("🌐 Loading image from URL:", src);
      img.crossOrigin = "anonymous";
      img.src = src;
    }
  });
};

// Calculate scale and position to fit screenshot in screen area
export const calculateFitScale = (
  imageWidth,
  imageHeight,
  targetWidth,
  targetHeight
) => {
  const scaleX = targetWidth / imageWidth;
  const scaleY = targetHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  const scaledWidth = imageWidth * scale;
  const scaledHeight = imageHeight * scale;

  // Center the image in the target area
  const offsetX = (targetWidth - scaledWidth) / 2;
  const offsetY = (targetHeight - scaledHeight) / 2;

  return {
    scale,
    width: scaledWidth,
    height: scaledHeight,
    offsetX,
    offsetY,
  };
};

// Device configurations
export const DEVICE_CONFIGS = {
  "iphone-15-pro": {
    name: "iPhone 15 Pro",
    width: 300,
    height: 650,
    cornerRadius: 50,
    screenCornerRadius: 47,
    borderWidth: 3,
    notchWidth: 90,
    notchHeight: 22,
    type: "phone",
  },
  "iphone-16-pro-max": {
    name: "iPhone 16 Pro Max",
    width: 340, // Larger width for Pro Max
    height: 740, // Larger height for Pro Max
    cornerRadius: 55, // Slightly larger corner radius
    screenCornerRadius: 52,
    borderWidth: 3,
    notchWidth: 100, // Slightly larger Dynamic Island
    notchHeight: 24,
    type: "phone",
  },
  "ipad-pro": {
    name: "iPad Pro",
    width: 500, // iPad landscape width
    height: 650, // iPad landscape height
    cornerRadius: 25, // Smaller corner radius for iPad
    screenCornerRadius: 22,
    borderWidth: 4,
    notchWidth: 0, // iPads don't have Dynamic Island
    notchHeight: 0,
    type: "tablet",
  },
};

// Generate mockup by creating a clean iPhone frame and inserting screenshot
export const generateMockup = async (
  screenshotFile,
  deviceType = "iphone-15-pro"
) => {
  try {
    console.log("🚀 Starting mockup generation for:", screenshotFile.name);
    console.log("📱 Device type:", deviceType);

    // Load screenshot only
    console.log("📱 Loading screenshot...");
    const screenshot = await loadImage(screenshotFile);

    console.log("✅ Screenshot loaded successfully");
    console.log(
      "📸 Screenshot dimensions:",
      screenshot.width,
      "x",
      screenshot.height
    );

    // Get device configuration
    const phoneConfig =
      DEVICE_CONFIGS[deviceType] || DEVICE_CONFIGS["iphone-15-pro"];

    // Calculate screen area - true edge-to-edge like Rotato
    const screenArea = {
      x: phoneConfig.borderWidth, // Start at border edge
      y: phoneConfig.borderWidth, // Start at border edge
      width: phoneConfig.width, // Full device width
      height: phoneConfig.height, // Full device height
    };

    console.log("📐 Phone config:", phoneConfig);
    console.log("📐 Screen area:", screenArea);

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Make canvas just the device size without extra border padding
    canvas.width = phoneConfig.width + phoneConfig.borderWidth * 2;
    canvas.height = phoneConfig.height + phoneConfig.borderWidth * 2;

    console.log("🎨 Canvas created:", canvas.width, "x", canvas.height);

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw realistic iPhone frame like Rotato
    // Outer shadow for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;

    // Main titanium frame - Rotato-style realistic color
    ctx.fillStyle = "#5A5A5A"; // More accurate titanium color
    ctx.beginPath();
    ctx.roundRect(
      0,
      0,
      canvas.width,
      canvas.height,
      phoneConfig.cornerRadius + phoneConfig.borderWidth
    );
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Inner titanium highlight
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(
      1,
      1,
      canvas.width - 2,
      canvas.height - 2,
      phoneConfig.cornerRadius + phoneConfig.borderWidth - 1
    );
    ctx.stroke();

    // Draw phone screen area (pure black like Rotato)
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(
      phoneConfig.borderWidth,
      phoneConfig.borderWidth,
      phoneConfig.width,
      phoneConfig.height,
      phoneConfig.cornerRadius
    );
    ctx.fill();

    // Create clipping path for rounded screen first
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      screenArea.x,
      screenArea.y,
      screenArea.width,
      screenArea.height,
      phoneConfig.screenCornerRadius
    );
    ctx.clip();

    // Draw screenshot to fill entire screen area (stretch to fit)
    const drawX = screenArea.x;
    const drawY = screenArea.y;

    console.log(
      "🖌️ Drawing screenshot to fill screen at:",
      drawX,
      drawY,
      screenArea.width,
      screenArea.height
    );

    // Draw the screenshot stretched to fill the entire screen area
    ctx.drawImage(
      screenshot,
      drawX,
      drawY,
      screenArea.width,
      screenArea.height
    );

    // Restore context
    ctx.restore();

    // Draw Dynamic Island (notch) - only for phones, not tablets
    if (phoneConfig.type === "phone" && phoneConfig.notchWidth > 0) {
      const notchX =
        phoneConfig.borderWidth +
        phoneConfig.width / 2 -
        phoneConfig.notchWidth / 2;
      const notchY = phoneConfig.borderWidth + 8;

      ctx.fillStyle = "#000000"; // Pure black like real iPhone
      ctx.beginPath();
      ctx.roundRect(
        notchX,
        notchY,
        phoneConfig.notchWidth,
        phoneConfig.notchHeight,
        12
      );
      ctx.fill();
    }

    // Convert to data URL
    const dataURL = canvas.toDataURL("image/png", 1.0);
    console.log(
      "✨ Mockup generated successfully! Data URL length:",
      dataURL.length
    );

    return dataURL;
  } catch (error) {
    console.error("❌ Error generating mockup:", error);
    console.error("📋 Error details:", error.message);
    console.error("🔍 Error stack:", error.stack);
    throw new Error(`Failed to generate mockup: ${error.message}`);
  }
};

// Generate mockups for multiple screenshots
export const generateMultipleMockups = async (
  screenshotFiles,
  onProgress,
  deviceType = "iphone-15-pro"
) => {
  const mockups = [];

  for (let i = 0; i < screenshotFiles.length; i++) {
    try {
      const mockupDataURL = await generateMockup(
        screenshotFiles[i],
        deviceType
      );
      mockups.push({
        id: `mockup-${i + 1}`,
        originalFile: screenshotFiles[i],
        mockupDataURL,
        name: `mockup-${i + 1}.png`,
      });

      // Report progress
      if (onProgress) {
        onProgress((i + 1) / screenshotFiles.length);
      }
    } catch (error) {
      console.error(`Failed to generate mockup ${i + 1}:`, error);
    }
  }

  return mockups;
};
