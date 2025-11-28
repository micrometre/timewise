#!/bin/bash

# TimeWise - SQLite WASM Setup Script
# This script copies SQLite WASM files from the cashier project

SOURCE_DIR="$HOME/repos/cashier/public/sqlite-wasm"
TARGET_DIR="./public/sqlite-wasm"

echo "🚀 TimeWise - Setting up SQLite WASM files..."
echo ""

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Source directory not found: $SOURCE_DIR"
    echo ""
    echo "Please either:"
    echo "  1. Clone the cashier project to ~/repos/cashier, or"
    echo "  2. Download SQLite WASM from https://sqlite.org/download.html"
    echo ""
    echo "See public/sqlite-wasm/README.md for detailed instructions."
    exit 1
fi

# Create target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Copy files
echo "📦 Copying SQLite WASM files..."
cp -r "$SOURCE_DIR/jswasm" "$TARGET_DIR/"

# Check if copy was successful
if [ $? -eq 0 ]; then
    echo "✅ SQLite WASM files copied successfully!"
    echo ""
    echo "Files installed to: $TARGET_DIR/jswasm"
    echo ""
    echo "You can now run: npm run dev"
else
    echo "❌ Failed to copy files"
    exit 1
fi
