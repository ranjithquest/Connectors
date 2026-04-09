#!/bin/bash

# =============================================================================
# setup.sh — First-time setup for new contributors
# =============================================================================

set -e

REMOTE="gim-connectors"

# Colors
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}👋 Connector Admin — First-time Setup${RESET}"
echo "======================================="
echo ""

# --- Check we're in the right folder ---
FOLDER=$(basename "$PWD")
if [ "$FOLDER" != "Connectors" ]; then
  echo -e "${RED}✗ Wrong folder.${RESET}"
  echo ""
  echo "You need to run this from inside the Connectors folder, not '$FOLDER'."
  echo ""
  echo "  cd Connectors"
  echo "  ./setup.sh"
  echo ""
  exit 1
fi
echo -e "${GREEN}✓ Correct folder${RESET}"

# --- Check Node.js ---
echo "Checking Node.js..."
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js is not installed.${RESET}"
  echo ""
  echo "Please install Node.js 20 or above:"
  echo "  macOS:   brew install node@20 && brew link node@20 --force"
  echo "  Windows: download from https://nodejs.org (LTS version)"
  echo ""
  echo "Once installed, run ./setup.sh again."
  exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}✗ Node.js $NODE_VERSION found — version 20 or above is required.${RESET}"
  echo ""
  echo "  macOS:   brew install node@20 && brew link node@20 --force"
  echo "  Windows: download from https://nodejs.org (LTS version)"
  echo ""
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${RESET}"

# --- Install dependencies ---
echo "Installing dependencies..."
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${RESET}"

# --- Set up GitHub push access ---
echo ""
echo -e "${BOLD}Setting up GitHub push access...${RESET}"

REMOTE_URL=$(git remote get-url $REMOTE 2>/dev/null || echo "")

if [ -n "$REMOTE_URL" ] && [[ "$REMOTE_URL" == *"@"* ]]; then
  echo -e "${GREEN}✓ GitHub push access already configured${RESET}"
else
  echo ""
  echo "You need a Personal Access Token (PAT) to push your work to GitHub."
  echo ""
  echo "Steps to create one:"
  echo "  1. Go to github.com → your profile → Settings → Developer Settings"
  echo "     → Personal Access Tokens → Tokens (classic)"
  echo "  2. Click 'Generate new token (classic)'"
  echo "  3. Name it 'Connectors', set expiry to 90 days, check the 'repo' scope"
  echo "  4. Click 'Generate token' and copy it"
  echo "  5. Click 'Configure SSO' → 'Authorize' for gim-home"
  echo ""
  read -rp "Enter your GitHub username (e.g. yourname_microsoft): " GH_USER
  read -rsp "Paste your Personal Access Token: " GH_TOKEN
  echo ""

  git remote add $REMOTE "https://${GH_USER}:${GH_TOKEN}@github.com/gim-home/Connectors.git" 2>/dev/null || \
  git remote set-url $REMOTE "https://${GH_USER}:${GH_TOKEN}@github.com/gim-home/Connectors.git"

  # Derive display name from GitHub username (strip _microsoft suffix)
  DERIVED_NAME=$(echo "$GH_USER" | sed 's/_microsoft$//' | sed 's/_/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); print}')
  git config user.name "$DERIVED_NAME"

  echo -e "${GREEN}✓ Push access configured${RESET}"
  echo -e "${GREEN}✓ Name set to: $DERIVED_NAME${RESET}"
fi

# --- Done ---
echo ""
echo "======================================="
echo -e "${GREEN}${BOLD}✅ You're all set!${RESET}"
echo ""
echo -e "Starting the app at ${BLUE}http://localhost:3000/connectors${RESET}"
echo ""
echo "When you're ready to share your work with stakeholders, run:"
echo -e "  ${BOLD}./publish.sh${RESET}"
echo ""

# --- Start the app ---
if command -v open &>/dev/null; then
  # macOS — open browser after a short delay
  (sleep 4 && open http://localhost:3000/connectors) &
elif command -v start &>/dev/null; then
  # Windows Git Bash
  (sleep 4 && start http://localhost:3000/connectors) &
fi

npm run dev
