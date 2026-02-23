#!/bin/bash

# Development Setup Script

echo "🚀 Setting up Workout Tracker Backend..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv venv

# Activate virtual environment (Unix/Linux)
source venv/bin/activate

# Or for Windows:
# venv\Scripts\activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB URI and JWT secret"
fi

# Create models directory
mkdir -p models

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Update .env with your MongoDB connection string"
echo "2. Run: python -m uvicorn app.main:app --reload"
echo "3. Visit: http://localhost:8000/docs"
