#!/bin/bash

echo "🚀 GitHub Pages Deploy Script"
echo "================================"

# Build React app
echo "📦 Building React app..."
cd client
npm run build
cd ..

# Copy build files to root
echo "📁 Copying build files to root..."
cp -r client/build/* .

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "🚀 Deploy to GitHub Pages - $(date)"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push origin main

echo "✅ Deploy completed!"
echo "🌐 Your site will be available at: https://www.feellink.io/"
echo "⏰ Please wait 2-3 minutes for GitHub Pages to update"
