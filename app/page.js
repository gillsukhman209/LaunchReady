"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import Form from "../components/Form";
import OutputBox from "../components/OutputBox";
import Loader from "../components/Loader";
import LogoGenerator from "../components/LogoGenerator";
import MockupGenerator from "../components/MockupGenerator";
import IconUploader from "../components/icon-generator/IconUploader";
import IconPreview from "../components/icon-generator/IconPreview";
import PlatformSelector from "../components/icon-generator/PlatformSelector";
import GenerateButton from "../components/icon-generator/GenerateButton";
import SuccessMessage from "../components/icon-generator/SuccessMessage";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  // Overall workflow state
  const [workflowStep, setWorkflowStep] = useState("AWAITING_INPUT"); // AWAITING_INPUT, METADATA_READY, LOGO_READY, MOCKUPS_READY, ICONS_READY
  const [logoOption, setLogoOption] = useState(null); // 'generate' or 'upload'
  const [error, setError] = useState(null);

  // Data state
  const [originalFormData, setOriginalFormData] = useState(null);
  const [metadataResults, setMetadataResults] = useState(null);
  const [generatedLogoData, setGeneratedLogoData] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedMockups, setGeneratedMockups] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [generatedFilename, setGeneratedFilename] = useState("");

  // Loading states
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingIcons, setIsGeneratingIcons] = useState(false);

  const handleMetadataSubmit = async (formData) => {
    setIsGeneratingMetadata(true);
    setError(null);
    setOriginalFormData(formData);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: formData.appName,
          appDescription: formData.appDescription,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to generate metadata");
      if (result.success && result.data) {
        setMetadataResults(result.data);
        setWorkflowStep("METADATA_READY");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to generate metadata. Please try again.");
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleLogoGenerated = (logoData) => {
    setGeneratedLogoData(logoData);
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(
      logoData.imageUrl
    )}`;
    fetch(proxyUrl)
      .then((res) => (res.ok ? res.blob() : Promise.reject(res)))
      .then((blob) => {
        const file = new File([blob], `${logoData.appName}-logo.png`, {
          type: "image/png",
        });
        setUploadedImage({
          file: file,
          preview: logoData.imageUrl,
          name: file.name,
          size: blob.size,
        });
        setWorkflowStep("LOGO_READY");
      })
      .catch((err) => {
        console.error("Error converting logo to file:", err);
        setError("Failed to process generated logo. Please try again.");
      });
  };

  const handleLogoUpload = (imageData) => {
    setUploadedImage(imageData);
    setWorkflowStep("LOGO_READY");
  };

  const handleMockupsGenerated = (mockups) => {
    console.log(
      "📱 Mockups generated callback received:",
      mockups.length,
      "mockups"
    );
    console.log("🔄 Current workflow step:", workflowStep);
    setGeneratedMockups(mockups);
    setWorkflowStep("MOCKUPS_READY");
    console.log("✅ Workflow step updated to MOCKUPS_READY");
  };

  const handleIconGeneration = async () => {
    setIsGeneratingIcons(true);
    setError(null);
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

      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `AppIcons-${Date.now()}.zip`;
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches && matches[1]) filename = matches[1];
      }
      setGeneratedFilename(filename);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setWorkflowStep("ICONS_READY");
    } catch (err) {
      console.error("Icon generation error:", err);
      setError(err.message);
    } finally {
      setIsGeneratingIcons(false);
    }
  };

  const handleStartOver = () => {
    setWorkflowStep("AWAITING_INPUT");
    setLogoOption(null);
    setError(null);
    setOriginalFormData(null);
    setMetadataResults(null);
    setGeneratedLogoData(null);
    setUploadedImage(null);
    setGeneratedMockups([]);
    setSelectedPlatforms([]);
    setGeneratedFilename("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="space-y-12">
          {workflowStep === "AWAITING_INPUT" && (
            <Form
              onSubmit={handleMetadataSubmit}
              isLoading={isGeneratingMetadata}
            />
          )}

          {isGeneratingMetadata && (
            <div className="text-center py-12">
              <Loader size="lg" className="mb-4" />
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Generating your optimized App Store metadata...
              </p>
            </div>
          )}

          {metadataResults && workflowStep !== "AWAITING_INPUT" && (
            <OutputBox
              results={metadataResults}
              onNewGeneration={handleStartOver}
            />
          )}

          {(workflowStep === "METADATA_READY" ||
            workflowStep === "MOCKUPS_READY" ||
            workflowStep === "LOGO_READY" ||
            workflowStep === "ICONS_READY") && (
            <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Step 2: Provide an App Icon
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Generate a logo with AI or upload your own.
                </p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={() => setLogoOption("generate")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Generate Logo with AI
                </Button>
                <Button
                  onClick={() => setLogoOption("upload")}
                  variant="secondary"
                  className="px-8 py-3 rounded-xl font-semibold"
                >
                  Upload Own Logo
                </Button>
              </div>

              {logoOption === "generate" && (
                <LogoGenerator
                  appName={originalFormData.appName}
                  appDescription={originalFormData.appDescription}
                  onLogoGenerated={handleLogoGenerated}
                />
              )}

              {logoOption === "upload" && (
                <div className="max-w-xl mx-auto">
                  <IconUploader onImageUpload={handleLogoUpload} />
                </div>
              )}
            </div>
          )}

          {(workflowStep === "LOGO_READY" ||
            workflowStep === "MOCKUPS_READY" ||
            workflowStep === "ICONS_READY") &&
            uploadedImage && (
              <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Step 3: Generate App Icons
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select platforms to generate all required icon sizes.
                  </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-8">
                  <IconPreview imageData={uploadedImage} />
                  <PlatformSelector
                    selectedPlatforms={selectedPlatforms}
                    onPlatformChange={setSelectedPlatforms}
                  />
                  <GenerateButton
                    canGenerate={selectedPlatforms.length > 0}
                    isGenerating={isGeneratingIcons}
                    onGenerate={handleIconGeneration}
                    selectedCount={selectedPlatforms.length}
                  />
                </div>
              </div>
            )}

          {(workflowStep === "METADATA_READY" ||
            workflowStep === "MOCKUPS_READY" ||
            workflowStep === "LOGO_READY" ||
            workflowStep === "ICONS_READY") && (
            <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Step 4: Generate App Mockups
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload app screenshots to create device mockups.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <MockupGenerator onMockupsGenerated={handleMockupsGenerated} />
              </div>
            </div>
          )}

          {workflowStep === "ICONS_READY" && (
            <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
              <SuccessMessage
                onNewGeneration={handleStartOver}
                generatedFilename={generatedFilename}
              />
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center py-8 mt-16">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Next.js and OpenAI • Generate optimized App Store
            metadata in seconds
          </p>
        </footer>
      </div>
    </div>
  );
}
