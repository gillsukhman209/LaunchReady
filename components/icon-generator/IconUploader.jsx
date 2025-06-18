"use client";

import { useState, useRef } from "react";

export default function IconUploader({ onImageUpload }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file";
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return "Please upload a PNG or JPEG file";
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB";
    }

    return null;
  };

  const validateImage = (img) => {
    // Check dimensions (minimum 512x512)
    if (img.width < 512 || img.height < 512) {
      return "Image must be at least 512x512 pixels";
    }

    // Warn if not square
    if (img.width !== img.height) {
      return "Warning: Image is not square. It will be cropped to square.";
    }

    return null;
  };

  const processFile = async (file) => {
    setIsUploading(true);
    setError("");

    try {
      const fileError = validateFile(file);
      if (fileError) {
        setError(fileError);
        return;
      }

      // Create image object to validate dimensions
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const imageError = validateImage(img);
        if (imageError && !imageError.startsWith("Warning:")) {
          setError(imageError);
          setIsUploading(false);
          return;
        }

        // Create a square version of the image
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;

        // Draw the image centered and cropped to square
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, -offsetX, -offsetY, img.width, img.height);

        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png");

        const imageData = {
          file,
          dataUrl,
          width: size,
          height: size,
          size: file.size,
          name: file.name,
        };

        onImageUpload(imageData);
        if (imageError) {
          setError(imageError); // Show warning
        }
        setIsUploading(false);
      };

      img.onerror = () => {
        setError("Failed to load image. Please try a different file.");
        setIsUploading(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError("Failed to process file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-out
          ${
            isDragOver
              ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
          }
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isUploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="space-y-4">
          {isUploading ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 animate-spin"
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
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Processing Image...
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Please wait while we validate your image
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Drop your app icon here
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Or click to browse files
              </p>
              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <p>Supported: PNG, JPEG</p>
                <p>Minimum: 512x512px • Maximum: 10MB</p>
                <p>Recommended: 1024x1024px or larger</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div
          className={`mt-4 p-4 rounded-xl ${
            error.startsWith("Warning:")
              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                error.startsWith("Warning:") ? "text-amber-500" : "text-red-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  error.startsWith("Warning:")
                    ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              />
            </svg>
            <p
              className={`text-sm font-medium ${
                error.startsWith("Warning:")
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
