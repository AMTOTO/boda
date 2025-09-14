#!/bin/bash

# Setup script for Python FastAPI backend
echo "Setting up Python environment..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not available in this environment."
    echo "This WebContainer environment is optimized for Node.js applications."
    echo ""
    echo "To run this Python FastAPI backend, you have several options:"
    echo ""
    echo "1. Deploy to a Python-compatible platform like:"
    echo "   - Railway (railway.app)"
    echo "   - Render (render.com)"
    echo "   - Heroku"
    echo "   - Google Cloud Run"
    echo ""
    echo "2. Run locally on your machine:"
    echo "   - Install Python 3.11"
    echo "   - Create virtual environment: python3 -m venv venv"
    echo "   - Activate: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)"
    echo "   - Install dependencies: python3 -m pip install -r requirements.txt"
    echo "   - Run: uvicorn api.translate:app --host 0.0.0.0 --port 8000 --reload"
    echo ""
    echo "3. Use Docker:"
    echo "   - Build: docker build -t paraboda-api ."
    echo "   - Run: docker run -p 8000:8000 paraboda-api"
    exit 1
fi

# If Python is available, proceed with setup
python3 -m venv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt

echo "Setup complete! Run the following to start the server:"
echo "source venv/bin/activate"
echo "uvicorn api.translate:app --host 0.0.0.0 --port 8000 --reload"