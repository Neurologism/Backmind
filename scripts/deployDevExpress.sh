#!/bin/bash
PATH="/home/gh-actions/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
cd /home/gh-actions/Backmind
npm install pm2@latest -g
pm2 update
pm2 delete backmind-server
git reset --hard
git clean -fd
git checkout developement
git pull
npm i
npm run build
npm run start
pm2 save --force
