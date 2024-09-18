#!/bin/bash
PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games"
cd /home/brainet/backmind
pm2 delete backmind-train
git reset --hard
git clean -f
git checkout main
git pull
npm i
npm run build
npm run train-start
