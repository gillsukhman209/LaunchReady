"use client";

export default function IconPreview({ imageData }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getQualityStatus = () => {
    if (imageData.width >= 1024) {
      return {
        status: "excellent",
        color: "text-green-600 dark:text-green-400",
        text: "Excellent Quality",
      };
    } else if (imageData.width >= 512) {
      return {
        status: "good",
        color: "text-amber-600 dark:text-amber-400",
        text: "Good Quality",
      };
    } else {
      return {
        status: "poor",
        color: "text-red-600 dark:text-red-400",
        text: "Poor Quality",
      };
    }
  };

  const quality = getQualityStatus();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Image Preview
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Your uploaded icon is ready for processing
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Image Preview */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative">
            <img
              src={imageData.dataUrl}
              alt="App icon preview"
              className="w-32 h-32 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
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
          </div>
        </div>

        {/* Image Details */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Info */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                File Details
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Name:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium truncate ml-2">
                    {imageData.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Size:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {formatFileSize(imageData.size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Dimensions:
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {imageData.width} × {imageData.height}px
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Status */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Quality Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      quality.status === "excellent"
                        ? "bg-green-500"
                        : quality.status === "good"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className={`text-sm font-medium ${quality.color}`}>
                    {quality.text}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {imageData.width >= 1024
                    ? "Perfect for all icon sizes"
                    : imageData.width >= 512
                    ? "May lose quality at larger sizes"
                    : "Will be blurry at larger sizes"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
