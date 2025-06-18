"use client";

import { useState } from "react";
import ScreenshotUploader from "./mockup-generator/ScreenshotUploader";
import MockupPreview from "./mockup-generator/MockupPreview";
import DeviceSelector from "./mockup-generator/DeviceSelector";
import ColorSelector from "./mockup-generator/ColorSelector";
import Button from "./ui/Button";
import { generateMultipleMockups } from "../lib/mockupUtils";
import { downloadMockupsAsZip } from "../lib/zipUtils";

export default function MockupGenerator({ onMockupsGenerated }) {
  const [uploadedScreenshots, setUploadedScreenshots] = useState([]);
  const [generatedMockups, setGeneratedMockups] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("iphone-15-pro");
  const [selectedColor, setSelectedColor] = useState("natural-titanium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleScreenshotsUpload = (screenshots) => {
    setUploadedScreenshots(screenshots);
    // Clear previous mockups when new screenshots are uploaded
    setGeneratedMockups([]);
    setError(null);
  };

  const handleDeviceChange = (deviceType) => {
    setSelectedDevice(deviceType);
    // Clear previous mockups when device changes
    setGeneratedMockups([]);
    setError(null);
  };

  const handleColorChange = (colorType) => {
    setSelectedColor(colorType);
    // Clear previous mockups when color changes
    setGeneratedMockups([]);
    setError(null);
  };

  const handleGenerateMockups = async () => {
    if (uploadedScreenshots.length === 0) {
      console.log("❌ No screenshots uploaded");
      return;
    }

    console.log("🚀 Starting mockup generation process...");
    console.log("📁 Screenshots to process:", uploadedScreenshots.length);

    setIsGenerating(true);
    setProgress(0);
    setError(null);

    try {
      const files = uploadedScreenshots.map((screenshot) => screenshot.file);
      console.log(
        "📋 Files extracted:",
        files.map((f) => f.name)
      );

      const mockups = await generateMultipleMockups(
        files,
        setProgress,
        selectedDevice,
        selectedColor
      );
      console.log("✨ Mockups generated successfully:", mockups.length);

      setGeneratedMockups(mockups);

      // Notify parent component
      if (onMockupsGenerated) {
        console.log("📤 Notifying parent component...");
        onMockupsGenerated(mockups);
      }
    } catch (err) {
      console.error("❌ Error generating mockups:", err);
      console.error("📋 Error details:", err.message);
      setError(err.message || "Failed to generate mockups. Please try again.");
    } finally {
      setIsGenerating(false);
      setProgress(0);
      console.log("🏁 Mockup generation process completed");
    }
  };

  const handleDownloadAll = async () => {
    if (generatedMockups.length === 0) return;

    try {
      await downloadMockupsAsZip(generatedMockups, "app-mockups.zip");
    } catch (err) {
      console.error("Error downloading mockups:", err);
      setError("Failed to download mockups. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Device Selector */}
      <DeviceSelector
        selectedDevice={selectedDevice}
        onDeviceChange={handleDeviceChange}
      />

      {/* Color Selector */}
      <ColorSelector
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
      />

      {/* Upload Section */}
      <ScreenshotUploader
        onScreenshotsUpload={handleScreenshotsUpload}
        maxFiles={3}
      />

      {/* Generate Button */}
      {uploadedScreenshots.length > 0 && generatedMockups.length === 0 && (
        <div className="text-center">
          <Button
            onClick={handleGenerateMockups}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Mockups... {Math.round(progress * 100)}%
              </div>
            ) : (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Generate {uploadedScreenshots.length} Mockup
                {uploadedScreenshots.length > 1 ? "s" : ""}
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Loading Progress */}
      {isGenerating && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          ></div>
        </div>
      )}

      {/* Generated Mockups Grid */}
      {generatedMockups.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your App Mockups Are Ready!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Download individual mockups or get them all at once
            </p>
          </div>

          {/* Mockups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedMockups.map((mockup, index) => (
              <MockupPreview key={mockup.id} mockup={mockup} index={index} />
            ))}
          </div>

          {/* Download All Button */}
          {generatedMockups.length > 1 && (
            <div className="text-center">
              <Button
                onClick={handleDownloadAll}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m-1-13a9 9 0 110 18 9 9 0 010-18z"
                  />
                </svg>
                Download All Mockups (ZIP)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">
              {error}
            </p>
            <Button
              onClick={() => setError(null)}
              variant="secondary"
              className="px-4 py-2"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
