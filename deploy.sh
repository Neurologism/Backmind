#!/bin/bash
PATH="/home/emil/.nvm/versions/node/v20.12.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/snap/bin"
cd backmind
pm2 stop backmind
git pull
npm i
npx tsc
pm2 start dist/index.js -i 1 --name backmind
