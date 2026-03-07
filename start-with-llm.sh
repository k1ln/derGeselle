#!/bin/bash

echo "Starting Phi-4 3.8B model..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Error: Ollama is not installed. Please install it first:"
    echo "https://ollama.ai"
    exit 1
fi

# Start Ollama server in background if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "Starting Ollama server..."
    ollama serve &
    OLLAMA_PID=$!
    sleep 3
fi

# Pull/run phi4 model in background
echo "Loading phi4:3.8b model..."
ollama run phi4:3.8b &
PHI4_PID=$!

# Give the model a moment to initialize
sleep 2

# Start webpack dev server
echo "Starting development server..."
npm run dev-only

# Cleanup on exit
trap "kill $OLLAMA_PID $PHI4_PID 2>/dev/null" EXIT
