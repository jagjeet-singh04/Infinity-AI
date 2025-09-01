import React, { useRef } from "react";

export default function Upload({ onFileSelect, previews, onRemove }) {
  const fileRef = useRef();

  // handle file selection (from camera or gallery)
  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    // Append new files to existing ones, limit to 5
    onFileSelect((prevFiles) => {
      const combined = [...prevFiles, ...newFiles];
      return combined.slice(0, 5);
    });

    // reset input to allow re-capturing the same file
    e.target.value = "";
  }

  // trigger camera directly
  function handleOpenCamera() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        multiple
        ref={fileRef}
        onChange={handleFileChange}
      />

      {/* Camera / Upload button */}
      <button
        onClick={handleOpenCamera}
        className="w-full py-3 rounded bg-indigo-600 text-white font-medium"
      >
        Capture / Upload Image
      </button>

      {/* Preview grid */}
      {previews && previews.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          {previews.map((preview, idx) => (
            <div key={idx} className="relative">
              <img
                src={preview}
                alt={`preview-${idx}`}
                className="w-full h-32 object-contain rounded"
              />
              <button
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
