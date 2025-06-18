"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ScreenshotUploader({
  onScreenshotsUpload,
  maxFiles = 3,
}) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

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

      // Auto-collapse after first upload
      if (uploadedFiles.length === 0 && updatedFiles.length > 0) {
        setIsExpanded(false);
      }
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

  // Show compact version when files are uploaded and not expanded
  if (uploadedFiles.length > 0 && !isExpanded) {
    return (
      <div className="bg-gray-800/50 rounded-xl border border-gray-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium">
                {uploadedFiles.length} screenshot
                {uploadedFiles.length !== 1 ? "s" : ""} uploaded
              </p>
              <p className="text-gray-400 text-sm">
                {uploadedFiles.length < maxFiles &&
                  `${maxFiles - uploadedFiles.length} more allowed`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add more button */}
            {uploadedFiles.length < maxFiles && (
              <div
                {...getRootProps()}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg cursor-pointer transition-colors"
              >
                <input {...getInputProps()} />+ Add More
              </div>
            )}

            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full expanded version
  return (
    <div className="space-y-6">
      {/* Collapse button when files are uploaded */}
      {uploadedFiles.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsExpanded(false)}
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            Minimize uploader
          </button>
        </div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="relative group">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                <div className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-80 object-contain rounded-lg bg-gray-50 dark:bg-gray-700"
                  />
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
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
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
