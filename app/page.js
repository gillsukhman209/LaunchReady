"use client";

import { useState } from "react";
import Header from "../components/Header";
import Form from "../components/Form";
import OutputBox from "../components/OutputBox";
import Loader from "../components/Loader";

export default function Home() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call in Phase 1
      // Simulating API call with mock data for now
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResults = {
        appName: "TaskMaster Pro",
        subtitle: "Organize & Boost Productivity",
        category: "Productivity",
        promotionalText:
          "Transform your daily workflow with TaskMaster Pro - the ultimate productivity companion that helps you organize tasks, set priorities, and achieve your goals faster than ever before.",
        description:
          "TaskMaster Pro revolutionizes how you manage your daily tasks and boost productivity. With an intuitive interface and powerful features, this app helps you organize your workflow, set smart priorities, and track progress toward your goals. Whether you're a busy professional, student, or entrepreneur, TaskMaster Pro adapts to your unique needs with customizable task categories, deadline reminders, and progress analytics. Experience the perfect blend of simplicity and functionality that transforms overwhelming to-do lists into manageable, actionable plans. Join thousands of users who have already discovered the secret to effortless productivity and time management.",
      };

      setResults(mockResults);
    } catch (err) {
      setError("Failed to generate metadata. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGeneration = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <main className="space-y-12">
          {!results && !isLoading && (
            <Form onSubmit={handleFormSubmit} isLoading={isLoading} />
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader size="lg" className="mb-4" />
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Generating your optimized App Store metadata...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This usually takes 10-30 seconds
              </p>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
                <button
                  onClick={handleNewGeneration}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {results && (
            <OutputBox
              results={results}
              onNewGeneration={handleNewGeneration}
            />
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
