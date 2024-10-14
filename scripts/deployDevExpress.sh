#!/bin/bash
PATH="/home/gh-actions/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
cd /home/gh-actions/Backmind
pm2 delete backmind-server
git reset --hard
git clean -f
git checkout developement
git pull
npm i
npm run build
npm run server:start
pm2 save --force
