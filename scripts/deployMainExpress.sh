#!/bin/bash
PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
cd /home/brainet/Backmind
pnpm install pm2@latest -g
pm2 update
git reset --hard
git clean -fd
git checkout main
git pull
pnpm i
pnpm run build
pm2 delete backmind-server
pnpm run start
pm2 save --force
