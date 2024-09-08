# Backmind

The backend repo for brainet utilizing nodejs, express, typescript and mongodb.

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
Below, you can find an example configuration utilizing some environment variables.

```
MONGO_URI='mongodb://user:password@hostname:port'
JWT_SECRET=Coffee // if not specified, it is generated randomly
JWT_TOKEN_EXPIRE_IN=24h
EXPRESS_PORT=3000
DB_NAME=backmind
RESET_DB=false
SALT_ROUNDS=10
SEND_ERR_TO_CLIENT=true // should only be enabled in devlopement
LOG_LEVEL=info // either silly, debug, verbose, info, warn, error
MIN_PASS_LENGTH=6
MIN_BRAINET_TAG_LENGTH=3
MIN_PROJECT_NAME_LENGTH=1
```

## Documentation

Documentation is generated using swagger and can be accessed at `/api-docs`.
The swagger documentation is generated from comments next to the routes.

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

## Logging

Logging is done via winston and morgan.
Morgan logs all requests to [`./logs/access.log`](./logs/access.log) and the console stream.
Winston logs general log messages to [`./logs/error.log`](./logs/error.log) and [`./logs/combined.log`](./logs/combined.log).
The log level for winston can be set via LOG_LEVEL in [`.env`](.env)
