"use client";

import Button from "../ui/Button";

export default function SuccessMessage({ onNewGeneration, generatedFilename }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
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
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Icons Generated Successfully!
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Your ZIP file,{" "}
        <span className="font-semibold text-purple-600 dark:text-purple-400">
          {generatedFilename || "AppIcons.zip"}
        </span>
        , should be in your downloads folder.
      </p>
      <Button
        onClick={onNewGeneration}
        variant="primary"
        className="px-8 py-3 rounded-xl text-lg"
      >
        <div className="flex items-center space-x-2">
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Generate New Icons</span>
        </div>
      </Button>
    </div>
  );
}
