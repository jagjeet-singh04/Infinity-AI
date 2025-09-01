export default function TextResult({
  extractedText,
  loading,
  error,
  onExtract,
  onOpenChat,
  onOpenChatApp,   // new
  onCopy,
  hasImage,
}) {
  const texts = Array.isArray(extractedText) ? extractedText : extractedText ? [extractedText] : [];

  return (
    <div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onExtract}
          className="w-full py-3 rounded bg-indigo-600 text-white font-medium"
          disabled={loading || !hasImage}
        >
          {loading ? "Extracting…" : "Extract Text"}
        </button>

        <button
          onClick={onOpenChat}
          className="w-full py-3 rounded bg-green-600 text-white font-medium"
          disabled={texts.length === 0}
        >
          Open in ChatGPT (Web)
        </button>

        <button
          onClick={onOpenChatApp}
          className="w-full py-3 rounded bg-purple-600 text-white font-medium"
          disabled={texts.length === 0}
        >
          Open in ChatGPT App 📱
        </button>
      </div>

      <div className="mt-3">
        <label className="text-sm text-gray-600">Extracted Text{texts.length > 1 ? "s" : ""}</label>
        <div className="mt-1 space-y-3">
          {texts.length === 0 ? (
            <textarea
              readOnly
              placeholder="Extracted text will appear here"
              className="w-full h-40 p-3 border rounded resize-none"
            />
          ) : (
            texts.map((text, idx) => (
              <textarea
                key={idx}
                readOnly
                value={text}
                className="w-full h-40 p-3 border rounded resize-none"
              />
            ))
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onCopy}
            className="flex-1 py-2 rounded bg-gray-100"
            disabled={texts.length === 0}
          >
            Copy All
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <p className="text-xs text-gray-400 mt-2">
          Note: Auto-paste isn’t possible. Copy happens to clipboard, then open ChatGPT and paste.
        </p>
      </div>
    </div>
  );
}
