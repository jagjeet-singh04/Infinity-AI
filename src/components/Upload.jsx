import React, { useRef } from "react";

export default function Upload({ onFileSelect, previews, onRemove }) {
  const fileRef = useRef();
  const cameraRef = useRef();

  // Handle file selection (upload from device)
  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) onFileSelect(files);
  }

  // Handle camera capture
  function handleCapture(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) onFileSelect(files);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Upload Button */}
      <label className="w-full">
        <div
          className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="text-sm text-gray-600"
            onClick={() => fileRef.current.click()}
          >
            Upload Image(s)
          </button>
        </div>
      </label>

      {/* Capture Button */}
      <label className="w-full">
        <div
          className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-gray-300"
        >
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCapture}
          />
          <button
            type="button"
            className="text-sm text-gray-600"
            onClick={() => cameraRef.current.click()}
          >
            Capture from Camera
          </button>
        </div>
      </label>

      {/* Image previews */}
      {previews && previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2">
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
