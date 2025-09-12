# Python 3.10 Installation Guide

## For Local Development (if needed)

### Windows
1. Download Python 3.10 from [python.org](https://www.python.org/downloads/release/python-3100/)
2. Run the installer and check "Add Python to PATH"
3. Verify installation:
```bash
python --version
# Should show Python 3.10.x
```

### macOS
Using Homebrew:
```bash
brew install python@3.10
```

Using pyenv:
```bash
pyenv install 3.10.0
pyenv global 3.10.0
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.10 python3.10-pip python3.10-venv
```

### Linux (CentOS/RHEL)
```bash
sudo dnf install python3.10 python3.10-pip
```

## Note

This ParaBoda application is a **frontend-only React application** and doesn't require Python to run. The application uses:

- Node.js and npm for package management
- React with TypeScript for the frontend
- Mock services for AI and translation features

If you're planning to add Python backend services later, Python 3.10 would be a good choice, but it's not needed for the current application.

## Current Application Setup

To run the ParaBoda application:

```bash
# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The application will run on `http://localhost:5173`