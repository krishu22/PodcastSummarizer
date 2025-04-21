'''from fastapi import APIRouter, UploadFile, File
from app.services.whisper_service import transcribe_audio

router = APIRouter()

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    result = await transcribe_audio(file)
    return result'''
    
    
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Literal, Optional, List
from app.services.whisper_service import (
    transcribe_youtube_url,
    transcribe_youtube_url_with_timestamps
)
from app.services.emotion_analyze_service import (analyze_emotions)

router = APIRouter()
    
class TranscriptionRequest(BaseModel):
    url: HttpUrl
    mode: Optional[Literal['none', 'segment', 'word']] = 'none'
    
class EmotionData(BaseModel):
    start: float
    end: float
    text: str

@router.post("/transcribe-youtube")
async def transcribe_youtube(request: TranscriptionRequest):
    try:
        if request.mode in ('segment', 'word'):
            return transcribe_youtube_url_with_timestamps(str(request.url), request.mode)
        else:
            return transcribe_youtube_url(str(request.url))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/analyze_emotions")
async def analyze_emotions(request: List[EmotionData]):
    result = analyze_emotions(request)
    return result
    
