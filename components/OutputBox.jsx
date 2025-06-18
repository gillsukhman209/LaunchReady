"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function OutputBox({ results, onNewGeneration }) {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const ResultField = ({ label, value, maxChars, fieldKey }) => (
    <Card variant="result" className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
        {maxChars && (
          <span
            className={`text-sm ${
              value.length > maxChars
                ? "text-red-500"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {value.length}/{maxChars}
          </span>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {value}
      </p>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => copyToClipboard(value, fieldKey)}
        className="w-full"
      >
        {copiedField === fieldKey ? "Copied!" : "Copy to Clipboard"}
      </Button>
    </Card>
  );

  if (!results) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Generated App Store Metadata
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Review and copy the optimized metadata for your app
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button variant="secondary" onClick={onNewGeneration}>
            Generate New Metadata
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResultField
          label="App Name"
          value={results.appName}
          maxChars={30}
          fieldKey="appName"
        />

        <ResultField
          label="Subtitle"
          value={results.subtitle}
          maxChars={30}
          fieldKey="subtitle"
        />

        <ResultField
          label="App Store Category"
          value={results.category}
          fieldKey="category"
        />

        <ResultField
          label="Promotional Text"
          value={results.promotionalText}
          maxChars={170}
          fieldKey="promotionalText"
        />
      </div>

      <ResultField
        label="Full Description"
        value={results.description}
        maxChars={1000}
        fieldKey="description"
      />
    </div>
  );
}
