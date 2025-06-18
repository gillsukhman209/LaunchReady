"use client";

import { useState, useEffect } from "react";
import { getAvailableFrames } from "../../lib/frameUtils";

export default function FrameSelector({
  selectedFrames,
  onFrameSelectionChange,
  className = "",
}) {
  const [frames, setFrames] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const availableFrames = getAvailableFrames();
    setFrames(availableFrames);
  }, []);

  useEffect(() => {
    setSelectAll(selectedFrames.length === frames.length && frames.length > 0);
  }, [selectedFrames, frames]);

  const handleFrameToggle = (frameId) => {
    const isSelected = selectedFrames.includes(frameId);
    let newSelection;

    if (isSelected) {
      newSelection = selectedFrames.filter((id) => id !== frameId);
    } else {
      newSelection = [...selectedFrames, frameId];
    }

    onFrameSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      onFrameSelectionChange([]);
    } else {
      onFrameSelectionChange(frames.map((frame) => frame.id));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with select all */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Choose High-Quality Frames
        </h3>
        <button
          onClick={handleSelectAll}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {selectAll ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Frame grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frames.map((frame) => {
          const isSelected = selectedFrames.includes(frame.id);

          return (
            <div
              key={frame.id}
              onClick={() => handleFrameToggle(frame.id)}
              className={`
                relative cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                    : "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70"
                }
              `}
            >
              {/* Selection indicator */}
              <div
                className={`
                absolute top-3 right-3 z-10 w-6 h-6 rounded-full border-2 transition-all
                ${
                  isSelected
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400 bg-transparent"
                }
              `}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white absolute inset-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Frame preview */}
              <div className="p-4">
                <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-3 overflow-hidden relative">
                  <img
                    src={encodeURI(frame.file)}
                    alt={frame.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onLoad={(e) => {
                      // Hide loading overlay when image loads
                      const overlay = e.target.nextSibling;
                      if (overlay) overlay.style.display = "none";
                    }}
                    onError={(e) => {
                      console.error(
                        `Failed to load frame image: ${frame.file}`
                      );
                      // Show error state
                      e.target.style.display = "none";
                      const overlay = e.target.nextSibling;
                      if (overlay) {
                        overlay.innerHTML =
                          '<div class="flex items-center justify-center h-full text-red-400 text-sm">Failed to load</div>';
                        overlay.style.background = "#374151";
                      }
                    }}
                  />

                  {/* Loading state overlay */}
                  <div
                    className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(90deg, #374151 25%, #4B5563 50%, #374151 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                    }}
                  >
                    <div className="text-gray-400 text-sm">Loading...</div>
                  </div>
                </div>

                {/* Frame info */}
                <div className="space-y-1">
                  <h4 className="font-medium text-white">{frame.name}</h4>
                  <p className="text-sm text-gray-400">{frame.description}</p>

                  {/* Frame specs */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-700 rounded">
                      {frame.dimensions.width}×{frame.dimensions.height}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 rounded capitalize">
                      {frame.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection summary */}
      {selectedFrames.length > 0 && (
        <div className="text-sm text-gray-400 text-center">
          {selectedFrames.length} frame{selectedFrames.length !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
