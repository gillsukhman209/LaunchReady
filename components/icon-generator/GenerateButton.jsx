"use client";

export default function GenerateButton({
  canGenerate,
  isGenerating,
  onGenerate,
  selectedCount,
}) {
  return (
    <div className="text-center space-y-4">
      <button
        onClick={onGenerate}
        disabled={!canGenerate || isGenerating}
        className={`
          relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold rounded-2xl
          transition-all duration-300 ease-out transform min-w-[200px]
          ${
            canGenerate && !isGenerating
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
          }
        `}
      >
        {isGenerating ? (
          <>
            <svg
              className="w-6 h-6 mr-3 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Icons...
          </>
        ) : (
          <>
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Generate Icons
          </>
        )}
      </button>

      {/* Status Messages */}
      <div className="space-y-2">
        {!canGenerate && !isGenerating && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Please upload an image and select at least one platform
          </div>
        )}

        {canGenerate && !isGenerating && selectedCount > 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Ready to generate icons for {selectedCount} platform
            {selectedCount !== 1 ? "s" : ""}
          </div>
        )}

        {isGenerating && (
          <div className="space-y-2">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Processing your app icon...
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              This usually takes just a few seconds
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      {isGenerating && (
        <div className="max-w-md mx-auto">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Feature List */}
      {canGenerate && !isGenerating && (
        <div className="max-w-lg mx-auto mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>All required sizes</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Perfect quality</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>Ready for Xcode</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
              <span>Instant download</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
