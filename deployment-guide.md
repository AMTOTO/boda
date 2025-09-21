# ParaBoda Translation API Deployment Guide

## Overview
This guide helps you deploy the NLLB-200 translation API for enhanced Kenyan language support in ParaBoda.

## Option 1: Deploy to Render (Recommended)

### Step 1: Prepare Your Translation API
1. Create a new repository for your translation API
2. Add the Python code you provided to a file named `main.py`
3. Create a `requirements.txt` file:

```txt
fastapi==0.104.1
uvicorn==0.24.0
transformers==4.35.2
torch==2.1.1
pydantic==2.5.0
```

4. Create a `render.yaml` file:

```yaml
services:
  - type: web
    name: paraboda-translation-api
    env: python
    buildCommand: python -m pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and create an account
2. Connect your GitHub repository
3. Create a new Web Service
4. Select your translation API repository
5. Configure the service:
   - **Name**: `paraboda-translation-api`
   - **Environment**: `Python 3`
   - **Build Command**: `python -m pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy the service

### Step 3: Get Your API URL
After deployment, Render will provide you with a URL like:
`https://paraboda-translation-api.onrender.com`

## Option 2: Deploy to Vercel

### Step 1: Prepare for Vercel
1. Create a `vercel.json` file:

```json
{
  "functions": {
    "main.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/main.py"
    }
  ]
}
```

2. Update your `main.py` to work with Vercel:

```python
from fastapi import FastAPI
from mangum import Mangum
# ... rest of your code

app = FastAPI()
# ... your existing code

handler = Mangum(app)
```

### Step 2: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to deploy

## Option 3: Deploy to Railway

### Step 1: Prepare for Railway
1. Create a `railway.toml` file:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the service

## Step 4: Configure ParaBoda

### Update Environment Variables
1. Copy `.env.example` to `.env`
2. Update the translation API URL:

```env
VITE_NLLB_API_URL=https://your-deployed-api-url.onrender.com
VITE_LANGUAGE_API_KEY=your-api-key-if-needed
```

### Test the Integration
1. Start your ParaBoda development server: `npm run dev`
2. Open the language selector
3. Look for the "AI" indicator next to Kenyan languages
4. Test translation by switching between languages

## Supported Languages

The NLLB model supports these Kenyan languages:
- **Swahili** (`swh_Latn`)
- **Kikuyu** (`kik_Latn`)
- **Luo** (`luo_Latn`)
- **Luhya** (`luy_Latn`)
- **Kamba** (`kam_Latn`)
- **Somali** (`som_Latn`)
- **Kinyarwanda** (`kin_Latn`)

## Performance Optimization

### For Production:
1. **Use GPU instances** for faster translation (if available on your platform)
2. **Implement caching** to store frequently translated phrases
3. **Add rate limiting** to prevent abuse
4. **Use a CDN** to cache responses globally

### Example with Redis Caching:
```python
import redis
import json
from fastapi import FastAPI

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@app.post("/translate")
def translate(req: TranslationRequest):
    # Check cache first
    cache_key = f"{req.input_text}:{req.target_language}"
    cached_result = redis_client.get(cache_key)
    
    if cached_result:
        return json.loads(cached_result)
    
    # Translate if not in cache
    result = translator(req.input_text, src_lang="eng_Latn", tgt_lang=req.target_language, max_length=500)
    translation = {"translation": result[0]["translation_text"]}
    
    # Cache the result
    redis_client.setex(cache_key, 3600, json.dumps(translation))  # Cache for 1 hour
    
    return translation
```

## Monitoring and Maintenance

### Health Check Endpoint
Add this to your `main.py`:

```python
@app.get("/health")
def health_check():
    return {"status": "healthy", "model": model_name}
```

### Logging
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/translate")
def translate(req: TranslationRequest):
    logger.info(f"Translating: {req.input_text[:50]}... to {req.target_language}")
    # ... rest of your code
```

## Cost Considerations

1. **Model Size**: The 3.3B model is large and requires significant memory
2. **Consider smaller models** for development: `facebook/nllb-200-1.3B` or `facebook/nllb-200-distilled-600M`
3. **Use serverless functions** with cold start optimization
4. **Implement request batching** for multiple translations

## Troubleshooting

### Common Issues:
1. **Memory errors**: Use a smaller model or increase server memory
2. **Slow responses**: Implement caching and consider GPU acceleration
3. **Authentication errors**: Check your Hugging Face token
4. **CORS issues**: Add CORS middleware to your FastAPI app

### CORS Setup:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Security Best Practices

1. **Use environment variables** for sensitive data
2. **Implement rate limiting**
3. **Add authentication** for production use
4. **Validate input** to prevent injection attacks
5. **Use HTTPS** for all communications

Your ParaBoda system will now have advanced AI-powered translation for all major Kenyan languages!