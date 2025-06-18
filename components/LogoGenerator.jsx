"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Image from "next/image";

export default function LogoGenerator({
  appName,
  appDescription,
  onLogoGenerated,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState(null);
  const [error, setError] = useState(null);

  // Auto-start generation when component mounts
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    if (!appName?.trim() || !appDescription?.trim()) {
      setError("App name and description are required to generate a logo.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName, appDescription }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to generate logo");
      setGeneratedLogo(data.data);
    } catch (err) {
      console.error("Logo generation error:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Generating your logo...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">
            {error}
          </p>
          <Button
            onClick={handleGenerate}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (generatedLogo) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generated Logo for "{generatedLogo.appName}"
          </h3>
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <Image
                src={generatedLogo.imageUrl}
                alt={`Logo for ${generatedLogo.appName}`}
                width={256}
                height={256}
                className="rounded-xl shadow-md"
                unoptimized
              />
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onLogoGenerated(generatedLogo)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Use This Logo & Continue
            </Button>
            <Button
              onClick={handleGenerate}
              variant="secondary"
              className="px-8 py-3 rounded-xl font-semibold"
            >
              Generate New Logo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
