#!/bin/bash

# =============================================================================
# publish.sh — Push your feature and get a preview URL
# =============================================================================

set -e

REMOTE="gim-connectors"
PAGES_BASE="https://studious-adventure-j17vp6o.pages.github.io"

# Colors
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"

echo ""
echo -e "${BOLD}🚀 Connector Admin — Publish your feature${RESET}"
echo "============================================"
echo ""

# --- Check git remote is configured with credentials ---
REMOTE_URL=$(git remote get-url $REMOTE 2>/dev/null || echo "")

if [ -z "$REMOTE_URL" ] || [[ "$REMOTE_URL" != *"@"* ]]; then
  echo -e "${RED}✗ GitHub push access is not set up yet.${RESET}"
  echo ""
  echo "You need a Personal Access Token (PAT) to push to GitHub."
  echo ""
  echo "Steps:"
  echo "  1. Go to github.com → your profile → Settings → Developer Settings"
  echo "     → Personal Access Tokens → Tokens (classic)"
  echo "  2. Click 'Generate new token (classic)'"
  echo "  3. Name it 'Connectors', set expiry to 90 days, check the 'repo' scope"
  echo "  4. Click 'Configure SSO' → 'Authorize' for gim-home"
  echo "  5. Copy the token"
  echo ""
  read -rp "Enter your GitHub username: " GH_USER
  read -rsp "Paste your Personal Access Token: " GH_TOKEN
  echo ""

  git remote add $REMOTE "https://${GH_USER}:${GH_TOKEN}@github.com/gim-home/Connectors.git" 2>/dev/null || \
  git remote set-url $REMOTE "https://${GH_USER}:${GH_TOKEN}@github.com/gim-home/Connectors.git"

  echo -e "${GREEN}✓ Push access configured${RESET}"
  echo ""
fi

# --- Detect current branch ---
CURRENT_BRANCH=$(git branch --show-current)
OWNER_SLUG=$(git remote get-url $REMOTE | sed 's|https://||' | cut -d: -f1)

# --- Same feature or new? ---
if [ -n "$CURRENT_BRANCH" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "You are currently on branch: ${BOLD}$CURRENT_BRANCH${RESET}"
  echo ""
  echo "Is this an update to the same feature, or a new feature?"
  echo "  1) Same feature — push changes to $CURRENT_BRANCH"
  echo "  2) New feature  — create a new branch with its own preview URL"
  echo ""
  read -rp "Enter 1 or 2: " CHOICE
  echo ""

  if [ "$CHOICE" = "1" ]; then
    TARGET_BRANCH="$CURRENT_BRANCH"
    FEATURE_NAME="$CURRENT_BRANCH"
  else
    CHOICE="new"
  fi
else
  CHOICE="new"
fi

if [ "$CHOICE" = "new" ]; then
  # --- Ask for feature name ---
  echo -e "${BOLD}What would you like to call this feature?${RESET}"
  echo "  e.g. icon edit, new setup flow, diagnostics panel"
  echo ""
  read -rp "Feature name: " FEATURE_NAME
  echo ""

  # Generate branch slug
  FEATURE_SLUG=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
  TARGET_BRANCH="${OWNER_SLUG}/${FEATURE_SLUG}"

  # Check if branch already exists, append timestamp if so
  if git ls-remote --exit-code --heads $REMOTE "$TARGET_BRANCH" &>/dev/null; then
    TIMESTAMP=$(date +%m%d%H%M)
    TARGET_BRANCH="${TARGET_BRANCH}-${TIMESTAMP}"
    echo -e "${YELLOW}⚠ Branch already exists — using $TARGET_BRANCH instead${RESET}"
  fi

  echo -e "Creating branch: ${BOLD}$TARGET_BRANCH${RESET}"
  git checkout main
  git pull $REMOTE main --quiet
  git checkout -b "$TARGET_BRANCH"
  echo -e "${GREEN}✓ Branch created${RESET}"
  echo ""
fi

# --- Commit if there are changes ---
if ! git diff --cached --quiet || ! git diff --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  echo "Committing your changes..."
  git add -A
  git commit -m "feat: $FEATURE_NAME

Feature: $FEATURE_NAME
Date: $(date '+%Y-%m-%d')"
  echo -e "${GREEN}✓ Changes committed${RESET}"
else
  echo -e "${YELLOW}No uncommitted changes — pushing existing commits${RESET}"
fi

echo ""

# --- Push ---
echo "Pushing to GitHub..."
git push -u $REMOTE "$TARGET_BRANCH"
echo -e "${GREEN}✓ Pushed${RESET}"
echo ""

# --- Preview URL ---
PREVIEW_URL="${PAGES_BASE}/${TARGET_BRANCH}/connectors"

echo "============================================"
echo -e "${GREEN}${BOLD}✅ Deploying now — takes ~2–3 minutes${RESET}"
echo ""
echo -e "${BOLD}Your preview URL:${RESET}"
echo -e "${BLUE}${PREVIEW_URL}${RESET}"
echo ""
echo "Watch the build: https://github.com/gim-home/Connectors/actions"
echo ""
echo -e "${BOLD}Share with stakeholders:${RESET}"
echo "---"
echo "Hi team, here's a prototype I'd like your feedback on."
echo ""
echo "Feature: $FEATURE_NAME"
echo "Preview: $PREVIEW_URL"
echo ""
echo "This is a standalone preview — it won't affect the shared baseline."
echo "---"
echo ""
