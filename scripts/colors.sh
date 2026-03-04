#!/usr/bin/env bash
# Shared ANSI color definitions for olinda_utils.js shell scripts.
# Source this file instead of duplicating color variables:
#   source "$(dirname "${BASH_SOURCE[0]}")/colors.sh"

export RED='\033[0;31m'    # Red
export GREEN='\033[0;32m'  # Green
export YELLOW='\033[1;33m' # Bright yellow
export BLUE='\033[0;34m'   # Blue
export NC='\033[0m'        # Reset / No Color
