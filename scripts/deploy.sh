#!/bin/bash
touch deploy_worked
cd backmind
pm2 stop backmind
git pull
npm i
npx tsc
pm2 start dist/index.js -i 1 --name backmind
exit
