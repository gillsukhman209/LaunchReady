"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ScreenshotUploader({
  onScreenshotsUpload,
  maxFiles = 3,
}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Limit to maxFiles
      const filesToProcess = acceptedFiles.slice(
        0,
        maxFiles - uploadedFiles.length
      );

      const newFiles = filesToProcess.map((file, index) => ({
        id: `screenshot-${Date.now()}-${index}`,
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
      }));

      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onScreenshotsUpload(updatedFiles);
    },
    [uploadedFiles, maxFiles, onScreenshotsUpload]
  );

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onScreenshotsUpload(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles,
  });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          }
          ${
            uploadedFiles.length >= maxFiles
              ? "opacity-50 cursor-not-allowed"
              : ""
          }
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {uploadedFiles.length >= maxFiles
                ? `Maximum ${maxFiles} screenshots uploaded`
                : isDragActive
                ? "Drop your screenshots here"
                : "Upload App Screenshots"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {uploadedFiles.length >= maxFiles
                ? "Remove screenshots to upload new ones"
                : `Drag & drop or click to upload (${uploadedFiles.length}/${maxFiles})`}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              PNG or JPG files only, max 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
