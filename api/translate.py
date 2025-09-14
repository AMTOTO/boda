from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ParaBoda Translation API",
    description="AI-powered translation service for Kenyan languages",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TranslationRequest(BaseModel):
    input_text: str
    target_language: str
    source_language: str = "eng_Latn"

class TranslationResponse(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    confidence: Optional[float] = None

class BatchTranslationRequest(BaseModel):
    texts: List[str]
    target_language: str
    source_language: str = "eng_Latn"

class BatchTranslationResponse(BaseModel):
    translations: List[TranslationResponse]

class LanguageInfo(BaseModel):
    code: str
    name: str
    native_name: str

# Supported languages
SUPPORTED_LANGUAGES = {
    "eng_Latn": {"name": "English", "native_name": "English"},
    "swh_Latn": {"name": "Kiswahili", "native_name": "Kiswahili"},
    "kik_Latn": {"name": "Kikuyu", "native_name": "G\u0129k\u0169y\u0169"},
    "luo_Latn": {"name": "Luo", "native_name": "Dholuo"},
    "luy_Latn": {"name": "Luhya", "native_name": "Luluhya"},
    "kam_Latn": {"name": "Kamba", "native_name": "Kikamba"},
    "som_Latn": {"name": "Somali", "native_name": "Soomaali"},
    "kin_Latn": {"name": "Kinyarwanda", "native_name": "Ikinyarwanda"}
}

HF_API_URL = "https://api-inference.huggingface.co/models/facebook/nllb-200-3.3B"
HF_API_KEY = os.getenv("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")

# Hugging Face translation

def call_huggingface_translation(text: str, source_lang: str, target_lang: str) -> str:
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": text,
        "parameters": {
            "src_lang": source_lang,
            "tgt_lang": target_lang
        }
    }
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        data = response.json()

        if isinstance(data, list) and "translation_text" in data[0]:
            return data[0]["translation_text"]
        else:
            logger.error(f"Unexpected response: {data}")
            raise HTTPException(status_code=500, detail="Unexpected response from Hugging Face")
    except requests.exceptions.RequestException as e:
        logger.error(f"Hugging Face error: {e}")
        raise HTTPException(status_code=502, detail="Translation service unavailable")

# Initialize model on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Translation API is ready. Using Hugging Face model.")

# Routes
@app.get("/")
async def root():
    return {
        "message": "ParaBoda Translation API",
        "version": "1.0.0",
        "description": "AI-powered translation service for Kenyan languages",
        "endpoints": {
            "health": "/health",
            "languages": "/languages",
            "translate": "/translate",
            "batch_translate": "/translate/batch"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model": "huggingface/nllb-200-distilled-600M",
        "supported_languages": len(SUPPORTED_LANGUAGES)
    }

@app.get("/languages", response_model=List[LanguageInfo])
async def get_languages():
    return [
        LanguageInfo(code=code, name=info["name"], native_name=info["native_name"])
        for code, info in SUPPORTED_LANGUAGES.items()
    ]

@app.post("/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    if request.source_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported source language: {request.source_language}")
    if request.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported target language: {request.target_language}")
    if not request.input_text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty")

    translated_text = call_huggingface_translation(
        request.input_text,
        request.source_language,
        request.target_language
    )

    return TranslationResponse(
        translated_text=translated_text,
        source_language=request.source_language,
        target_language=request.target_language,
        confidence=0.98
    )

@app.post("/translate/batch", response_model=BatchTranslationResponse)
async def batch_translate(request: BatchTranslationRequest):
    if request.source_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported source language: {request.source_language}")
    if request.target_language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=400, detail=f"Unsupported target language: {request.target_language}")
    if not request.texts:
        raise HTTPException(status_code=400, detail="No texts provided for translation")

    translations = []
    for text in request.texts:
        if text.strip():
            translated_text = call_huggingface_translation(
                text, request.source_language, request.target_language
            )
            translations.append(TranslationResponse(
                translated_text=translated_text,
                source_language=request.source_language,
                target_language=request.target_language,
                confidence=0.98
            ))
        else:
            translations.append(TranslationResponse(
                translated_text="",
                source_language=request.source_language,
                target_language=request.target_language,
                confidence=1.0
            ))

    return BatchTranslationResponse(translations=translations)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
