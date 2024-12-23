#!/bin/bash
PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
cd /home/brainet/Backmind
npm install pm2@latest -g
pm2 update
git reset --hard
git clean -fd
git checkout main
git pull
npm i
npm run build
pm2 delete backmind-server
npm run start
pm2 save --force
