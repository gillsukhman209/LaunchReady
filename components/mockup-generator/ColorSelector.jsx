"use client";

import { FRAME_COLORS } from "../../lib/mockupUtils";

export default function ColorSelector({ selectedColor, onColorChange }) {
  const colors = Object.entries(FRAME_COLORS);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Frame Color
      </label>
      <div className="flex flex-wrap gap-3">
        {colors.map(([colorKey, colorConfig]) => (
          <button
            key={colorKey}
            onClick={() => onColorChange(colorKey)}
            className={`group relative p-1 rounded-xl transition-all duration-200 ${
              selectedColor === colorKey
                ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                : "hover:scale-105"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {/* Color Circle */}
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === colorKey
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-300 dark:border-gray-600 group-hover:border-gray-400"
                }`}
                style={{ backgroundColor: colorConfig.color }}
              >
                {/* Inner highlight to show the actual frame effect */}
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${colorConfig.highlight}, transparent 50%, ${colorConfig.highlight})`,
                  }}
                />
              </div>

              {/* Color Name */}
              <span
                className={`text-xs font-medium px-2 py-1 rounded-md transition-colors duration-200 ${
                  selectedColor === colorKey
                    ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                }`}
              >
                {colorConfig.name}
              </span>
            </div>

            {/* Selected Indicator */}
            {selectedColor === colorKey && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
