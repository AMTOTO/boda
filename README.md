# ParaBoda Translation API

Advanced AI-powered translation service for Kenyan languages using Meta's NLLB-200 model.

## Features

- **Multi-language Support**: English, Kiswahili, Kikuyu, Luo, Luhya, Kamba, Somali, Kinyarwanda
- **High-Quality Translation**: Powered by Meta's NLLB-200 model (mock implementation for demo)
- **Fast API**: RESTful API with automatic documentation
- **Batch Processing**: Translate multiple texts at once
- **Health Monitoring**: Built-in health checks and logging
- **CORS Enabled**: Ready for web application integration

## Supported Languages

| Language | Code | Native Name |
|----------|------|-------------|
| English | `eng_Latn` | English |
| Kiswahili | `swh_Latn` | Kiswahili |
| Kikuyu | `kik_Latn` | Gĩkũyũ |
| Luo | `luo_Latn` | Dholuo |
| Luhya | `luy_Latn` | Luluhya |
| Kamba | `kam_Latn` | Kikamba |
| Somali | `som_Latn` | Soomaali |
| Kinyarwanda | `kin_Latn` | Ikinyarwanda |

## API Endpoints

### POST /translate
Translate text from one language to another.

**Request Body:**
```json
{
  "input_text": "Hello, how are you?",
  "target_language": "swh_Latn",
  "source_language": "eng_Latn"
}
```

**Response:**
```json
{
  "translation": "Hujambo, habari yako?",
  "source_language": "eng_Latn",
  "target_language": "swh_Latn",
  "processing_time": 0.45
}
```

### POST /translate/batch
Translate multiple texts at once (max 10 texts per request).

### GET /health
Check API health status.

### GET /languages
Get list of supported languages.

## Deployment Options

### Option 1: Render (Recommended)
1. Push this code to a GitHub repository
2. Connect to Render and deploy as a Web Service
3. Use the provided `render.yaml` configuration

### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Uses the provided `railway.toml` configuration

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Uses the provided `vercel.json` configuration

### Option 4: Docker
```bash
docker build -t paraboda-translation .
docker run -p 8000:8000 paraboda-translation
```

## Local Development

1. Install dependencies:
```bash
python -m pip install -r requirements.txt
```

2. Set environment variable:
```bash
export HF_TOKEN=your_hugging_face_token
```

3. Run the server:
```bash
python api/translation.py
```

Alternative method using uvicorn directly:
```bash
python -m uvicorn api.translate:app --host 0.0.0.0 --port 8000 --reload
```

4. Access the API documentation at `http://localhost:8000/docs`

## Environment Variables

- `HF_TOKEN`: Hugging Face token for model access (optional for mock version)
- `PORT`: Server port (default: 8000)

## Performance Notes

- This is a mock implementation for demonstration purposes
- In production, you would use the actual NLLB-200 model
- First request may be slower due to model loading
- Consider using GPU instances for faster translation
- Implement caching for frequently translated phrases in production

## Upgrading to Full NLLB-200

To use the actual NLLB-200 model instead of mock translations:

1. Uncomment the transformers imports in `api/translation.py`
2. Ensure you have sufficient memory (8GB+ recommended)
3. Add your Hugging Face token to environment variables
4. The model will be downloaded on first use

## License

This project is licensed under the MIT License - see the LICENSE file for details.