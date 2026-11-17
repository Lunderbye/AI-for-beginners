#!/usr/bin/env bash
# Startar presentationen lokalt / Serves the presentation locally: http://localhost:8790 (talk track: /talk.html)
set -euo pipefail
PORT="${1:-8790}"
cd "$(dirname "$0")"
echo "Deck:        http://localhost:$PORT"
echo "Talk track:  http://localhost:$PORT/talk.html"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
