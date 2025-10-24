#!/bin/bash

# Otomatik commit ve push scripti
echo "🔄 Değişiklikler GitHub'a kaydediliyor..."

# Tüm değişiklikleri ekle
git add .

# Commit mesajı oluştur
COMMIT_MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S') - $(git status --porcelain | wc -l) dosya değişti"

# Commit yap
git commit -m "$COMMIT_MSG"

# GitHub'a push yap
git push origin main

echo "✅ Tüm değişiklikler GitHub'a kaydedildi!"
echo "🌐 Siteniz güncelleniyor: https://feelink.io"
