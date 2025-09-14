from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import logging
import time
import requests
from typing import Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="ParaBoda Translation API",
    description="Hugging Face NLLB translation service for Kenyan languages",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    input_text: str
    target_language: str
    source_language: Optional[str] = "eng_Latn"

class TranslationResponse(BaseModel):
    translation: str
    source_language: str
    target_language: str
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    api_key_configured: bool
    model: str

# Startup event to log configuration
@app.on_event("startup")
async def startup_event():
    logger.info("✅ Translation API server starting up...")
    
    # Check if API key is available and log (partially masked)
    api_key = os.getenv('HF_API_KEY')
    if api_key:
        masked_key = f"{api_key[:5]}...{api_key[-5:]}" if len(api_key) > 10 else "***masked***"
        logger.info(f"HF_API_KEY is configured: {masked_key}")
        logger.info(f"API key length: {len(api_key)} characters")
    else:
        logger.warning("⚠️ HF_API_KEY environment variable is not set!")
    
    # Log environment info
    logger.info(f"PORT: {os.getenv('PORT', '8000')}")
    logger.info(f"Python version info available")
    
    logger.info("🚀 Translation API ready to serve requests")

# Enhanced health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with API key status"""
    api_key = os.getenv('HF_API_KEY')
    return HealthResponse(
        status="ok",
        api_key_configured=bool(api_key),
        model="facebook/nllb-200-distilled-600M"
    )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "ParaBoda Translation API",
        "version": "1.0.0",
        "model": "facebook/nllb-200-distilled-600M",
        "endpoints": {
            "translate": "/translate",
            "health": "/health"
        }
    }

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(payload: TranslationRequest):
    """Translate text using Hugging Face NLLB model"""
    start_time = time.time()
    
    logger.info(f"Translating from {payload.source_language} to {payload.target_language}: '{payload.input_text[:50]}...'")
    
    api_key = os.getenv('HF_API_KEY')
    if not api_key:
        logger.error("Missing HF_API_KEY environment variable")
        raise HTTPException(
            status_code=500, 
            detail="API key not configured. Please set the HF_API_KEY environment variable."
        )
    
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        # Prepare the request payload
        request_payload = {
            "inputs": payload.input_text,
            "parameters": {
                "src_lang": payload.source_language,
                "tgt_lang": payload.target_language
            }
        }
        
        logger.info(f"Sending request to Hugging Face API with payload: {request_payload}")
        
        response = requests.post(
            "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M",
            headers=headers,
            json=request_payload,
            timeout=30  # Add timeout to prevent hanging requests
        )
        
        logger.info(f"Hugging Face API response status: {response.status_code}")
        
        # Check if the request was successful
        if response.status_code != 200:
            logger.error(f"Hugging Face API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Hugging Face API error: {response.text}"
            )
        
        result = response.json()
        logger.info(f"Raw API response: {result}")
        
        # Extract translation from response
        if isinstance(result, list) and len(result) > 0:
            translation = result[0].get('translation_text', str(result))
        elif isinstance(result, dict):
            translation = result.get('translation_text', str(result))
        else:
            translation = str(result)
        
        processing_time = time.time() - start_time
        logger.info(f"Translation successful in {processing_time:.2f}s: '{translation[:50]}...'")
        
        return TranslationResponse(
            translation=translation,
            source_language=payload.source_language,
            target_language=payload.target_language,
            processing_time=processing_time
        )
    
    except requests.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Error connecting to Hugging Face API: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Translation failed: {str(e)}"
        )

# Middleware to log requests and handle exceptions
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Time: {process_time:.2f}s"
        )
        
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"{request.method} {request.url.path} - "
            f"Error: {str(e)} - "
            f"Time: {process_time:.2f}s"
        )
        
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "message": str(e)
            }
        )

# Run the application with uvicorn when script is executed directly
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting uvicorn server on port {port}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        workers=1
    )