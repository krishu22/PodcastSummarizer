import whisper
import os
import uuid
import tempfile
from fastapi import UploadFile
from app.utils.audio_utils import save_upload_file
import whisper_timestamped as whisperts

import yt_dlp

# Load Whisper model
model = whisper.load_model("tiny")  # Can be "small", "medium", etc.

# Transcription for uploaded audio file
async def transcribe_audio(file: UploadFile):
    temp_path = await save_upload_file(file)

    audio = whisper.load_audio(temp_path)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(model.device)

    _, probs = model.detect_language(mel)
    detected_lang = max(probs, key=probs.get)

    options = whisper.DecodingOptions()
    result = whisper.decode(model, mel, options)

    return {
        "language": detected_lang,
        "transcription": result.text
    }


# Download and convert YouTube audio using yt_dlp
def download_youtube_audio(url: str) -> str:
    temp_dir = tempfile.mkdtemp()
    output_path = os.path.join(temp_dir, f"{uuid.uuid4()}.%(ext)s")

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'quiet': True
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
    except Exception as e:
        raise RuntimeError(f"Failed to download or process YouTube audio: {e}")

    # The actual file will have `.mp3` extension now
    mp3_path = output_path.replace('%(ext)s', 'mp3')
    if not os.path.exists(mp3_path):
        raise FileNotFoundError("MP3 file not found after yt_dlp download.")

    return mp3_path


# Transcribe from YouTube URL
def transcribe_youtube_url(url: str):
    try:
        mp3_file = download_youtube_audio(url)

        result = model.transcribe(mp3_file)

        return {
            "language": result.get("language"),
            "transcription": result.get("text")
        }

    except Exception as e:
        raise RuntimeError(f"Error during transcription: {e}")
    
def transcribe_youtube_url_with_timestamps(url:str, mode="segment"):
    
    try:
        
        mp3_file = download_youtube_audio(url)
        result = whisperts.transcribe(model, mp3_file)
        
        if mode == "segment":
            segments = []
            print("starting...")
            for segment in result["segments"]:
                segments.append({
                    "start": segment["start"],
                    "end": segment["end"],
                    "text": segment["text"]
                })
            print(segments)
            return {
                "language": result.get("language"),
                "transcription": result.get("text"),
                "segments": segments
            }
            
        elif mode == "word":
            words = []
            #print(result["segments"])
            for segment in result["segments"]:
                for w in segment.get("words",[]):
                    #text = w.get("word") or w.get("text") or w.get("alignedword")
                    words.append({
                        "word": w["text"],
                        "start": float(w["start"]),
                        "end": float(w["end"])
                    })
            return { 
                "language": result.get("language"),
                "transcription": result.get("text"),
                "words": words
            }
        
        else:
            raise ValueError("Invalid mode. Use 'segment' or 'word'.")
            
        
    except Exception as e:
        raise RuntimeError(f"Error during transcription with timestamps: {e}")
