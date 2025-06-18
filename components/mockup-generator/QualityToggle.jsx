"use client";

export default function QualityToggle({
  qualityMode,
  onQualityChange,
  className = "",
}) {
  const modes = [
    {
      key: "standard",
      label: "Standard",
      description: "Fast generation with Canvas frames",
      icon: "⚡",
    },
    {
      key: "high-quality",
      label: "High Quality",
      description: "Professional frames with premium finish",
      icon: "✨",
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-white">Mockup Quality</h3>

      <div className="grid grid-cols-2 gap-3">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onQualityChange(mode.key)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              ${
                qualityMode === mode.key
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70"
              }
            `}
          >
            {/* Selection indicator */}
            <div
              className={`
              absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all
              ${
                qualityMode === mode.key
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400 bg-transparent"
              }
            `}
            >
              {qualityMode === mode.key && (
                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Content */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{mode.icon}</span>
                <span className="font-medium text-white">{mode.label}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {mode.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Quality info */}
      <div className="text-xs text-gray-500 space-y-1">
        {qualityMode === "standard" && (
          <p>• Generate mockups instantly with programmatic device frames</p>
        )}
        {qualityMode === "high-quality" && (
          <p>
            • Use professional frame images for premium results (1024×1536px)
          </p>
        )}
      </div>
    </div>
  );
}
