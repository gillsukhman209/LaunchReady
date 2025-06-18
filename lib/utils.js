// Utility functions for the App Store Connect Helper

export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ");
}

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

export function formatCharacterCount(current, max) {
  const isOverLimit = current > max;
  return {
    text: `${current}/${max}`,
    isOverLimit,
    percentage: (current / max) * 100,
  };
}
