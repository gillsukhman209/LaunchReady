"use client";

export default function SuccessMessage({ onNewGeneration }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
        <svg
          className="w-10 h-10 text-green-600 dark:text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Icons Generated Successfully! 🎉
        </h3>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          Your app icons have been generated and downloaded. Check your
          downloads folder for the ZIP file.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 max-w-lg mx-auto">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
          What's included in your download:
        </h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-2 text-left">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Complete Assets.xcassets folder
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            All 9 required iPhone icon sizes
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            Properly configured Contents.json
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            README with usage instructions
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={onNewGeneration}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Generate More Icons
        </button>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p>
            Need icons for iPad or watchOS? Those platforms are coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
