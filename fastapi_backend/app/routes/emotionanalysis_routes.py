from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.emotion_analyze_service import (analyze_emotions)

router = APIRouter()
    
class EmotionData(BaseModel):
    start: float
    end: float
    text: str 
    

@router.post("/analyze_emotions")
async def analyze_emotions_route_function(request: List[EmotionData]):
    print("emotion analysis route working...")
    try:
        result = analyze_emotions(request)
        print("result returned by route: ", result)
        return result
    except Exception as e:
        print("Error in analyze_emotions route:", e)
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

    
