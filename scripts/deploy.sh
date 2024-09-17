#!/bin/bash
PATH="/home/emil/.nvm/versions/node/v20.12.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/snap/bin"
cd backmind
pm2 stop backmind-server
pm2 delete backmind-server
git reset --hard
git clean -f
git checkout main
git pull
npm i
npm run build
npm run server-start
