# app/app.py
# app/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Use absolute imports, starting from the project root
from app.routes import whisper_routes, emotionanalysis_routes


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(whisper_routes.router, prefix="/whisper", tags=["Whisper"])
app.include_router(emotionanalysis_routes.router, prefix="/analysis", tags=["Analysis"])

@app.get("/")
def read_root():
    return {"Hello": "World"}