"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

export default function Form({ onSubmit, isLoading }) {
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!appName.trim() || !appDescription.trim()) {
      return;
    }

    onSubmit({
      appName: appName.trim(),
      appDescription: appDescription.trim(),
    });
  };

  const isFormValid =
    appName.trim().length > 0 && appDescription.trim().length > 0;

  return (
    <Card variant="elevated" className="p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Tell Us About Your App
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Provide your app name and description to generate optimized App
            Store metadata
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="TaskMaster Pro"
            required
            maxLength={50}
            showCharCount
          />

          <Input
            label="App Description"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            placeholder="A productivity app that helps users organize their daily tasks and boost efficiency..."
            required
            maxLength={500}
            showCharCount
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isFormValid || isLoading}
            className="w-full"
          >
            {isLoading
              ? "Generating Metadata..."
              : "Generate App Store Metadata"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
