"use client";

import { DEVICE_CONFIGS } from "../../lib/mockupUtils";

export default function DeviceSelector({ selectedDevice, onDeviceChange }) {
  const devices = Object.entries(DEVICE_CONFIGS);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Choose Device
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {devices.map(([deviceKey, deviceConfig]) => (
          <button
            key={deviceKey}
            onClick={() => onDeviceChange(deviceKey)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedDevice === deviceKey
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`${
                  deviceConfig.type === "tablet" ? "w-12 h-8" : "w-8 h-12"
                } rounded-lg border-2 ${
                  selectedDevice === deviceKey
                    ? "border-blue-500 bg-blue-100 dark:bg-blue-800"
                    : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {/* Mini device icon */}
                <div
                  className={`w-full h-full rounded-md ${
                    selectedDevice === deviceKey
                      ? "bg-blue-500"
                      : "bg-gray-400 dark:bg-gray-500"
                  }`}
                  style={{
                    aspectRatio:
                      deviceConfig.type === "tablet"
                        ? `${deviceConfig.width}/${deviceConfig.height}`
                        : deviceKey === "iphone-16-pro-max"
                        ? "340/740"
                        : "300/650",
                  }}
                >
                  {/* Only show notch for phones */}
                  {deviceConfig.type === "phone" && (
                    <div
                      className={`w-3 h-1 mx-auto mt-1 rounded-full ${
                        selectedDevice === deviceKey
                          ? "bg-blue-200"
                          : "bg-gray-200 dark:bg-gray-400"
                      }`}
                    ></div>
                  )}
                </div>
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    selectedDevice === deviceKey
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {deviceConfig.name}
                </h3>
                <p
                  className={`text-sm ${
                    selectedDevice === deviceKey
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {deviceConfig.width}×{deviceConfig.height}px
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
