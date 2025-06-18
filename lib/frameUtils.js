// Frame configurations for high-quality mockups
export const FRAME_CONFIGS = {
  "iphone-15-pro": {
    id: "iphone-15-pro",
    file: "/iPhone 15 pro mockup.png",
    name: "iPhone 15 Pro",
    description: "Premium iPhone frame with titanium finish",
    deviceType: "phone",
    dimensions: { width: 1024, height: 1536 },
    // Screen area coordinates (estimated based on typical iPhone frame proportions)
    // These may need adjustment after visual testing
    screenArea: {
      x: 112,
      y: 289,
      width: 800,
      height: 958,
    },
    aspectRatio: 19.5 / 9, // iPhone 15 Pro screen ratio
    category: "apple",
  },
  "rotato-style": {
    id: "rotato-style",
    file: "/rotato_style.png",
    name: "Rotato Style",
    description: "Professional design mockup frame",
    deviceType: "phone",
    dimensions: { width: 1024, height: 1536 },
    // Screen area coordinates (estimated)
    screenArea: {
      x: 112,
      y: 289,
      width: 800,
      height: 958,
    },
    aspectRatio: 19.5 / 9,
    category: "professional",
  },
};

// Get all available frames
export const getAvailableFrames = () => {
  return Object.values(FRAME_CONFIGS);
};

// Get frame by ID
export const getFrameById = (frameId) => {
  return FRAME_CONFIGS[frameId] || null;
};

// Get frames by category
export const getFramesByCategory = (category) => {
  return Object.values(FRAME_CONFIGS).filter(
    (frame) => frame.category === category
  );
};

// Get frames by device type
export const getFramesByDeviceType = (deviceType) => {
  return Object.values(FRAME_CONFIGS).filter(
    (frame) => frame.deviceType === deviceType
  );
};

// Load frame image
export const loadFrameImage = (frameConfig) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = frameConfig.file;
  });
};

// Validate if coordinates are within frame bounds
export const validateScreenArea = (frameConfig) => {
  const { screenArea, dimensions } = frameConfig;
  return (
    screenArea.x >= 0 &&
    screenArea.y >= 0 &&
    screenArea.x + screenArea.width <= dimensions.width &&
    screenArea.y + screenArea.height <= dimensions.height
  );
};
