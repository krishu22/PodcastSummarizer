import React, { useState} from "react";
import axios from "axios";
import type { EmotionData } from "../../schemas/emotion-types";
import EmotionGraph from "./EmotionGraph";

interface Segment {
  start: number;
  end: number;
  text: string;
}

interface Word {
  start: number;
  end: number;
  word: string;
}

const YouTubeEmbed: React.FC = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [language, setLanguage] = useState("");
  const [mode, setMode] = useState<'none' | 'segment' | 'word'>('none');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);

  const extractVideoId = (input: string): string | null => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = input.match(regex);
    return match ? match[1] : null;
  };

  const handleValidate = () => {
    const id = extractVideoId(url.trim());
    if (!id) {
      setError("Please enter a valid YouTube URL.");
      setIsValidated(false);
      setVideoId(null);
      return;
    }

    setVideoId(id);
    setIsValidated(true);
    setError("");
    setTranscription("");
    setLanguage("");
    setSegments([]);
    setWords([]);
    setMode('none');
  };

  const handleTranscribe = async () => {
    if (!isValidated || !videoId) {
      setError("Validate a URL before transcribing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { url, mode };
      const resp = await axios.post(
        "http://localhost:8001/whisper/transcribe-youtube",
        payload
      );

      const { language: lang, transcription: text, segments: segs, words: wds } = resp.data;

      setLanguage(lang);
      setTranscription(text || "");
      
      if (mode==='segment') setSegments(segs);
      else if (mode==="word") setWords(wds);

      console.log("segments: ",segs);

    } catch (err: any) {
      console.error(err.response?.data ?? err);
      setError(err.response?.data.detail || "An error occurred while transcribing.");
    } finally {
      setLoading(false);
    }
  };

  // Updated handleEmotion with JSON stringify
  // Corrected handleEmotion - no need to pass segments
const handleEmotion = async () => {
  console.log("Handling emotions...");
  if (!segments.length) {
    console.log("segments is empty");
    return;
  }
  try {
    console.log("sending to backend...", JSON.stringify(segments));
    const res = await fetch("http://localhost:8001/analysis/analyze_emotions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(segments),
    });

    const data = await res.json();
    console.log("Emotion data:", data);
    setEmotionData(data);
    
  } catch (error) {
    console.error("Error fetching emotion data:", error);
  }
};

  /*useEffect(() => {
    if (segments.length > 0) {
      console.log("🚀 segments ready, calling emotion API…");
      handleEmotion(segments);
    }
  }, [segments]);*/

  return (
    <div className="dark:bg-gray-900 dark:text-white mx-auto my-6 p-6 rounded-2xl shadow-lg bg-gray-100">
      {/* URL Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
            setIsValidated(false);
            setError("");
          }}
          placeholder="YouTube URL"
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleValidate}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          {isValidated ? 'Validated' : 'Validate'}
        </button>
      </div>

      {isValidated && (
        <div className="mb-4">
          <label className="mr-2">Mode:</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as any)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="none">Full Transcript</option>
            <option value="segment">By Segment</option>
            <option value="word">By Word</option>
          </select>
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {videoId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video */}
          <div>
            <iframe
              width="100%"
              height="300"
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
              className="rounded-lg"
            />
            <button
              onClick={handleTranscribe}
              disabled={loading}
              className="mt-4 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              {loading ? 'Transcribing...' : 'Transcribe'}
            </button>
          </div>

          {/* Output */}
          <div className="max-h-[300px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {language && <p className="mb-2">Language: {language}</p>}

            {mode === 'none' && (
              <p className="whitespace-pre-wrap">{transcription}</p>
            )}

            {mode === 'segment' && (
              <div className="space-y-3">
                {segments.map((s, i) => (
                  <div key={i} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-mono text-sm">{s.start.toFixed(2)}s – {s.end.toFixed(2)}s</p>
                    <p className="mt-1">{s.text}</p>
                  </div>
                ))}
              </div>
            )}

            {mode === 'word' && (
              <div className="space-y-2">
                {words.map((w, i) => (
                  <div key={i} className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-mono text-xs">{w.start.toFixed(2)}s</span>
                    <span className="mx-2">{w.word}</span>
                    <span className="font-mono text-xs">{w.end.toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            )}

            {/* Analyze Emotions Button */}
            <button
              onClick={handleEmotion}
              className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
            >
              Analyze Emotions
            </button>

            {/* Render Emotion Graph if data is available */}
            {emotionData.length > 0 && <EmotionGraph data={emotionData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;