"use client";

import { useState } from "react";
import Header from "../../components/Header";
import IconUploader from "../../components/icon-generator/IconUploader";
import PlatformSelector from "../../components/icon-generator/PlatformSelector";
import GenerateButton from "../../components/icon-generator/GenerateButton";
import IconPreview from "../../components/icon-generator/IconPreview";
import SuccessMessage from "../../components/icon-generator/SuccessMessage";
import Card from "../../components/ui/Card";

export default function IconGenerator() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
  };

  const handlePlatformChange = (platforms) => {
    setSelectedPlatforms(platforms);
  };

  const handleNewGeneration = () => {
    setUploadedImage(null);
    setSelectedPlatforms([]);
    setGenerationSuccess(false);
    setError(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("platforms", JSON.stringify(selectedPlatforms));

      const response = await fetch("/api/generate-icons", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate icons");
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;

      // Extract filename from response header if available
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `AppIcons-${Date.now()}.zip`;
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches) {
          filename = matches[1];
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success state
      setGenerationSuccess(true);
    } catch (error) {
      console.error("Generation error:", error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = uploadedImage && selectedPlatforms.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="w-full text-center py-12 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              App Icon Generator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Upload your app icon and generate all required sizes for iPhone,
              iPad, watchOS, and macOS in seconds
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Instant Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>All Platform Sizes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Ready to Use</span>
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-12">
          <Card variant="elevated" className="p-10 max-w-4xl mx-auto">
            {generationSuccess ? (
              <SuccessMessage onNewGeneration={handleNewGeneration} />
            ) : (
              <div className="space-y-8">
                {/* Upload Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Upload Your App Icon
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300">
                      Upload a PNG image (minimum 512x512px recommended) to get
                      started
                    </p>
                  </div>
                  <IconUploader onImageUpload={handleImageUpload} />
                </div>

                {/* Preview Section */}
                {uploadedImage && (
                  <div className="space-y-6">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                      <IconPreview imageData={uploadedImage} />
                    </div>
                  </div>
                )}

                {/* Platform Selection */}
                {uploadedImage && (
                  <div className="space-y-6">
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          Select Platforms
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          Choose which platforms you need icons for
                        </p>
                      </div>
                      <PlatformSelector
                        selectedPlatforms={selectedPlatforms}
                        onPlatformChange={handlePlatformChange}
                      />
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                {uploadedImage && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                    <GenerateButton
                      canGenerate={canGenerate}
                      isGenerating={isGenerating}
                      onGenerate={handleGenerate}
                      selectedCount={selectedPlatforms.length}
                    />
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="p-6 max-w-2xl mx-auto">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                      Generation Failed
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                      {error}
                    </p>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </main>

        <footer className="text-center py-12 mt-20">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <svg
                  className="w-4 h-4"
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
                Icon Generator
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Generate all required app icon sizes for iPhone, iPad, watchOS,
              and macOS instantly
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
