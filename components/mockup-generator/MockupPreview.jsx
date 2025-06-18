"use client";

import { useState } from "react";
import { downloadFile } from "../../lib/zipUtils";
import Button from "../ui/Button";

export default function MockupPreview({ mockup, index }) {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = () => {
    downloadFile(mockup.mockupDataURL, mockup.name);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
      <div className="space-y-4">
        {/* Mockup Preview */}
        <div className="relative">
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200"
            onClick={openModal}
          >
            <img
              src={mockup.mockupDataURL}
              alt={`App mockup ${index + 1}`}
              className="w-full h-auto max-w-sm mx-auto rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                Click to enlarge
              </div>
            </div>
          </div>
        </div>

        {/* Mockup Info */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mockup {index + 1}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            iPhone 15 Pro frame
          </p>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleDownload}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Mockup
          </Button>
        </div>
      </div>

      {/* Modal for larger preview */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-2xl max-h-full">
            <img
              src={mockup.mockupDataURL}
              alt={`Mockup ${index + 1} - Full size`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-900 bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 text-xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="text-white text-sm bg-gray-900 bg-opacity-80 px-4 py-2 rounded-full mt-6">
            Click outside to close
          </div>
        </div>
      )}
    </div>
  );
}
