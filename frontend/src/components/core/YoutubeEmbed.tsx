import React, { useState } from "react";

const YouTubeEmbed: React.FC = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const extractVideoId = (youtubeUrl: string): string | null => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  const handleValidate = () => {
    if (!isValidated){
      const id = extractVideoId(url);
      if (id) {
        setVideoId(id);
        setError("");
        setIsValidated(true);
      } else {
        setVideoId(null);
        setError("Please enter a valid YouTube URL.");
        setIsValidated(false);
      }
    }
  };

  const handleTranscript = () => {
    // Your transcription logic here
  };

  return (
    <div className="mx-auto p-4 border rounded shadow">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste YouTube URL here"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleValidate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isValidated ? "URL Validated" : "Validate URL"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {videoId && (
        <div className="mt-4">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube Video"
            allowFullScreen
            className="rounded"
          ></iframe>
          <div className="mt-2">
            <button
              onClick={handleTranscript}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Transcribe 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
