#!/bin/bash
set -euo pipefail
PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
cd /home/azureuser/backmind
git reset --hard
git clean -fd
git checkout main
git pull
pnpm i
pnpm run build
if tmux has-session -t backmind 2>/dev/null; then
  tmux kill-session -t backmind
fi
tmux new -d -s backmind "cd /home/azureuser/backmind; node dist/src/main.js"
