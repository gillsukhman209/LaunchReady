"use client";

import { useEffect, useState } from "react";
import Card from "../ui/Card";

export default function IconPreview({ imageData }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [quality, setQuality] = useState("good");

  useEffect(() => {
    if (imageData && imageData.preview) {
      const img = new Image();
      img.src = imageData.preview;
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });

        if (img.width < 512 || img.height < 512) {
          setQuality("poor");
        } else if (img.width < 1024 || img.height < 1024) {
          setQuality("average");
        } else {
          setQuality("good");
        }
      };
    }
  }, [imageData]);

  if (!imageData) return null;

  const qualityStyles = {
    good: "text-green-500",
    average: "text-yellow-500",
    poor: "text-red-500",
  };

  const qualityText = {
    good: "Excellent",
    average: "Average",
    poor: "Poor",
  };

  const qualityDescription = {
    good: "Perfect for high-resolution icons.",
    average: "Good, but 1024x1024px is recommended for best results.",
    poor: "Will be blurry at larger sizes. 512x512px minimum recommended.",
  };

  return (
    <Card variant="default" className="p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
        Image Preview
      </h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
            <img
              src={imageData.preview}
              alt="App icon preview"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
        <div className="flex-grow space-y-4">
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">
              File Details
            </h4>
            <p className="text-slate-500 dark:text-slate-400 truncate">
              Name: {imageData.name}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Size: {(imageData.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Dimensions: {dimensions.width} x {dimensions.height} px
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-300">
              Quality Status
            </h4>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  quality === "good"
                    ? "bg-green-500"
                    : quality === "average"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></div>
              <p className={qualityStyles[quality]}>{qualityText[quality]}</p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {qualityDescription[quality]}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
