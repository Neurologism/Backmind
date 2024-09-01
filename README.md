# Backmind
The backend repo for brainet utilizing nodejs, express, typescript, mongodb and pm2 for production. 

## Installation

To clone the package locally and make it usable. 

```
git clone https://github.com/SirPythonPhoenix/backmind.git
cd backmind
npm i
```

Afterwards, use `npm run dev` to run for developement purposes. 

## Configuration

Configuration data is stored as environment variables in the [`.env`](/.env) file. 
The file is part of the [`.gitignore`](/.env), thus you will have to create it manually. 
Below, you can find an example configuration utilizing most environment variables. 

```
PORT=3000
```

## Production

Use the following pre-defined commands from [`package.json`](/package.json) for basic usage. 

```
npm run build // builds to /dist which is necessary to run
npm run start // starts the express-server 
npm run stop // stops the process
npm run restart // restarts the process
npm run monit // view process status
```

As backmind uses the pm2 package for production, it is possible to use the full array of pm2 commands. To do so, make sure you've installed pm2 globally `npm i -g pm2`. For instance, this would make it possible to use `pm2 start dist/index.js -i 0` to use the pm2 load balancer on all available cores on a dedicated server. You can find more [here](https://github.com/Unitech/pm2). 

