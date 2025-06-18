"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function IconUploader({ onImageUpload }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setError(null);

      if (fileRejections.length > 0) {
        setError(fileRejections[0].errors[0].message);
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            onImageUpload({
              file: file,
              preview: e.target.result,
              name: file.name,
              size: file.size,
            });
          };
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300
        ${
          isDragActive
            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
            : "border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500"
        }
      `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-slate-500 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v1m-4 5h12m-6 4l4-4-4-4"
              />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-300">
              Drop the icon here...
            </p>
          ) : (
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Drop your app icon here
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Or <span className="text-purple-600">click to browse</span>
              </p>
            </div>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            Supported: PNG, JPG (10MB max)
          </p>
        </div>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
