#!/bin/bash

# Build script for SystPulse
set -e

echo "🚀 Building SystPulse..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🏗️  Building frontend..."
npm run build

# Build Tauri app
echo "⚡ Building Tauri app..."
npm run tauri build

echo "✅ Build complete!"
echo "📁 Check src-tauri/target/release/bundle/ for executables"