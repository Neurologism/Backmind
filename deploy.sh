#!/bin/bash
cd backmind
/home/emil/.nvm/versions/node/v20.12.1/bin/pm2 stop backmind
git pull
/home/emil/.nvm/versions/node/v20.12.1/bin/npm i
/home/emil/.nvm/versions/node/v20.12.1/bin/npx tsc
/home/emil/.nvm/versions/node/v20.12.1/bin/pm2 start dist/index.js -i 1 --name backmind
