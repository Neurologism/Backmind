#!/bin/bash
set -euo pipefail
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
cd /home/azureuser/backmind
git reset --hard
git clean -fd
git checkout development
git pull
pnpm i
pnpm run build
if tmux has-session -t backmind 2>/dev/null; then
  tmux kill-session -t backmind
fi
tmux new -d -s backmind "cd /home/azureuser/backmind; node dist/src/main.js"
