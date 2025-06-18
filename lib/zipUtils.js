import JSZip from "jszip";

// Convert data URL to blob
export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
};

// Download single file
export const downloadFile = (dataURL, filename) => {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Create and download zip file with multiple mockups
export const downloadMockupsAsZip = async (
  mockups,
  zipFilename = "mockups.zip"
) => {
  try {
    const zip = new JSZip();

    // Add each mockup to the zip
    for (const mockup of mockups) {
      const blob = dataURLToBlob(mockup.mockupDataURL);
      zip.file(mockup.name, blob);
    }

    // Generate zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create download link
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = zipFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error creating zip file:", error);
    throw new Error("Failed to create zip file");
  }
};
