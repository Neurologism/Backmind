#!/bin/bash
PATH="/home/gh-actions/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
cd /home/gh-actions/Backmind
pnpm install pm2@latest -g
pm2 update
git reset --hard
git clean -fd
git checkout development
git pull
pnpm i
pnpm run build
pm2 delete backmind-server
pnpm run start:prod
pm2 save --force
