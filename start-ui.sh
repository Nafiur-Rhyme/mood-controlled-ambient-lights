#!/bin/bash

# Quick Start Script for Emotion-Based Lighting System

echo "🎭 Starting Emotion-Based Lighting System..."
echo ""

# Check if backend is running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend is already running on port 8000"
else
    echo "❌ Backend is not running!"
    echo "Please start the backend first:"
    echo "  python main.py"
    exit 1
fi

# Start the React frontend
echo ""
echo "🚀 Starting React frontend..."
echo "The app will open at http://localhost:3000"
echo ""

cd frontend
npm run dev
