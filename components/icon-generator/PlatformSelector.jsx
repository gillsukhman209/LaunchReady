"use client";

import { useState } from "react";

export default function PlatformSelector({
  selectedPlatforms,
  onPlatformChange,
}) {
  // For now, only iPhone - we'll add iPad and watchOS later
  const platforms = [
    {
      id: "iphone",
      name: "iPhone",
      description: "iPhone app icons",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 4h10v12H7V4z" />
        </svg>
      ),
      sizes: [
        "20×20",
        "29×29",
        "40×40",
        "60×60",
        "76×76",
        "83.5×83.5",
        "1024×1024",
      ],
      totalIcons: 14,
      comingSoon: false,
    },
    {
      id: "ipad",
      name: "iPad",
      description: "iPad app icons",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 6h18v10H3V6z" />
        </svg>
      ),
      sizes: ["20×20", "29×29", "40×40", "76×76", "83.5×83.5", "1024×1024"],
      totalIcons: 12,
      comingSoon: true,
    },
    {
      id: "watchos",
      name: "watchOS",
      description: "Apple Watch app icons",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      sizes: [
        "24×24",
        "27.5×27.5",
        "29×29",
        "40×40",
        "44×44",
        "50×50",
        "86×86",
        "98×98",
        "108×108",
      ],
      totalIcons: 18,
      comingSoon: true,
    },
  ];

  const handlePlatformToggle = (platformId) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (platform?.comingSoon) return; // Don't allow selection of coming soon platforms

    const isSelected = selectedPlatforms.includes(platformId);
    const newSelection = isSelected
      ? selectedPlatforms.filter((id) => id !== platformId)
      : [...selectedPlatforms, platformId];

    onPlatformChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const isDisabled = platform.comingSoon;

          return (
            <div
              key={platform.id}
              className={`
                relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200
                ${
                  isSelected && !isDisabled
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : isDisabled
                    ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 opacity-60 cursor-not-allowed"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
              `}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              {/* Coming Soon Badge */}
              {platform.comingSoon && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Coming Soon
                </div>
              )}

              {/* Selection Indicator */}
              {isSelected && !isDisabled && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              <div className="space-y-4">
                {/* Platform Icon & Name */}
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    flex items-center justify-center w-12 h-12 rounded-xl
                    ${
                      isSelected && !isDisabled
                        ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }
                  `}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Platform Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Total icons:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {platform.totalIcons}
                    </span>
                  </div>

                  {/* Size Preview */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Includes sizes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {platform.sizes.slice(0, 4).map((size, index) => (
                        <span
                          key={size}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded"
                        >
                          {size}
                        </span>
                      ))}
                      {platform.sizes.length > 4 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                          +{platform.sizes.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedPlatforms.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">
                {selectedPlatforms.length} platform
                {selectedPlatforms.length !== 1 ? "s" : ""} selected
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Total of{" "}
                {platforms
                  .filter((p) => selectedPlatforms.includes(p.id))
                  .reduce((sum, p) => sum + p.totalIcons, 0)}{" "}
                icons will be generated
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
