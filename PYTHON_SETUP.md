# ParaBoda Translation API Setup Guide

## Overview
The ParaBoda system includes an optional Python translation API for enhanced language support. The frontend React application works independently and includes fallback translations.

## Quick Start (Recommended)

### Option 1: Use Frontend Only
The React application includes built-in translations and works without the Python backend:

```bash
npm install
npm run dev
```

The application will use mock translations for East African languages.

### Option 2: Deploy Python API to Cloud

#### Deploy to Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy using the included `railway.toml` configuration
4. Set environment variable: `HF_TOKEN=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`

#### Deploy to Render
1. Go to [render.com](https://render.com)
2. Create new Web Service from GitHub
3. Use the included `render.yaml` configuration
4. Deploy automatically

#### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Uses included `vercel.json` configuration

### Option 3: Local Development

#### Requirements
- Python 3.11+
- pip

#### Setup
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API
uvicorn api.translate:app --host 0.0.0.0 --port 8000 --reload
```

#### Environment Variables
```bash
export HF_TOKEN=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
export PORT=8000
```

### Option 4: Docker

```bash
# Build the image
docker build -t paraboda-api .

# Run the container
docker run -p 8000:8000 -e HF_TOKEN=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 paraboda-api
```

Or use Docker Compose:
```bash
docker-compose up
```

## API Endpoints

Once running, the API provides:

- `GET /health` - Health check
- `POST /translate` - Translate text
- `GET /languages` - Supported languages

## Supported Languages

- English (eng_Latn)
- Kiswahili (swh_Latn) 
- French (fra_Latn)
- Kinyarwanda (kin_Latn)
- Luganda (lug_Latn)
- Lingala (lin_Latn)

## Integration with Frontend

If you deploy the Python API, update your frontend environment:

```env
VITE_TRANSLATION_API_URL=https://your-api-url.com
```

## Troubleshooting

### Common Issues

1. **Python not available**: Use cloud deployment options
2. **Package installation fails**: Use the simplified requirements.txt
3. **API timeout**: The API includes fallback translations
4. **Memory issues**: Use the distilled NLLB model (600M parameters)

### Fallback Behavior

The system is designed to work without the Python API:
- Frontend includes built-in translations
- Mock translation service provides basic phrases
- All features remain functional

## Production Deployment

For production, we recommend:
1. **Railway** or **Render** for simplicity
2. **Google Cloud Run** for scalability
3. **Vercel** for serverless deployment

The frontend can be deployed separately to any static hosting service.

## Support

The ParaBoda system prioritizes functionality over perfect translations. The built-in mock translations cover essential health and transport terminology for East African communities.