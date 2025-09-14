# ParaBoda Translation API - Deployment Guide

This Python FastAPI backend cannot run directly in the current WebContainer environment, which is optimized for Node.js applications.

## Deployment Options

### 1. Railway (Recommended)
Railway provides excellent Python support with the configuration already included in `railway.toml`.

1. Visit [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy automatically using the existing `railway.toml` configuration
4. Set your `HF_TOKEN` environment variable in Railway dashboard

### 2. Render
Render offers good Python hosting with the configuration in `render.yaml`.

1. Visit [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Use the existing `render.yaml` configuration
5. Set your `HF_TOKEN` environment variable

### 3. Local Development

#### Prerequisites
- Python 3.11 installed
- Git

#### Setup Steps
```bash
# Clone the repository
git clone <your-repo-url>
cd <your-repo-name>

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
python3 -m pip install -r requirements.txt

# Set environment variable (optional)
export HF_TOKEN="your_huggingface_token_here"

# Run the application
uvicorn api.translate:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### 4. Docker

#### Build and Run
```bash
# Build the image
docker build -t paraboda-api .

# Run the container
docker run -p 8000:8000 -e HF_TOKEN="your_token_here" paraboda-api

# Or use docker-compose
docker-compose up
```

## API Endpoints

Once deployed, your API will have these endpoints:

- `GET /` - API information
- `GET /health` - Health check
- `GET /languages` - Supported languages
- `POST /translate` - Translate text
- `POST /translate/batch` - Batch translation

## Environment Variables

- `HF_TOKEN` - Hugging Face token (optional, falls back to mock translations)
- `PORT` - Port to run the server (default: 8000)
- `TRANSFORMERS_CACHE` - Cache directory for models
- `HF_HOME` - Hugging Face home directory

## Supported Languages

- English (eng_Latn)
- Kiswahili (swh_Latn)
- Kikuyu (kik_Latn)
- Luo (luo_Latn)
- Luhya (luy_Latn)
- Kamba (kam_Latn)
- Somali (som_Latn)
- Kinyarwanda (kin_Latn)

## Testing the API

```bash
# Health check
curl http://localhost:8000/health

# Translation example
curl -X POST "http://localhost:8000/translate" \
     -H "Content-Type: application/json" \
     -d '{
       "input_text": "Hello, how are you?",
       "target_language": "swh_Latn",
       "source_language": "eng_Latn"
     }'
```