# Backmind

The backend repo for brainet utilizing nodejs, express, typescript and mongodb.

## Installation

To clone the package locally and make it usable.

```bash
git clone https://github.com/SirPythonPhoenix/backmind.git
cd backmind
npm i
touch .env
```

Afterwards, use `npm run dev` to run for developement purposes.

You will also have to install brainet to be able to train models. First, make sure you have c++ and the g++ compiler installed. Then, run the following commands in the backmind directory.
The `brainet` directory is included in the .gitignore file. 

```bash
git clone https://github.com/Neurologism/brainet.git
cd brainet/json_interface
g++ run_json.cpp -std=c++20 -o runJson
```

If you're not on linux, pick a different compiler than g++. Also, do not set the environment variable `RECOMPILE_BRAINET='true'` if g++ is not available. You will have to compile manually. 

## Configuration

### Basics

Configuration data is stored as environment variables in the [`.env`](/.env) file.
The file is part of the [`.gitignore`](/.gitignore), thus you will have to create it manually.
Below, you can find an example configuration utilizing some environment variables. You can take a look at all environment and their default values in [`env.ts`](/src/env.ts) which initializes all environment variables. 

### Examples

Example developement configuration:

```bash
# /.env
MONGO_URI='mongodb://user:password@hostname:port'
RESET_DB="true"
JWT_TOKEN_EXPIRE_IN="24h"
DB_NAME="backmind-dev"
JWT_SECRET="qwerty"
SEND_ERR_TO_CLIENT="true"
LOG_LEVEL="debug"
```

Example server configuration:

```bash
# /.env
MONGO_URI='mongodb://user:password@hostname:port'
JWT_TOKEN_EXPIRE_IN="100h" # for users to keep logged in for a few days via cookies
DB_NAME="backmind"
LOG_LEVEL="info"
```

## Documentation

Documentation is generated using swagger and can be accessed at `/api-docs`.
The swagger documentation is generated from the [`swagger.ts`](/src/swagger.ts) file. 

## Production

Use the following pre-defined commands from [`package.json`](/package.json) for basic usage.

```bash
npm run build # builds to /dist which is necessary to run
npm run start # starts the express-server
npm run stop # stops the process
npm run restart # restarts the process
npm run monit # view process status
```

As backmind uses the pm2 package for production, it is possible to use the full array of pm2 commands. To do so, make sure you've installed pm2 globally `npm i -g pm2`. For instance, this would make it possible to use `pm2 start dist/index.js -i 0` to use the pm2 load balancer on all available cores on a dedicated server. You can find more [here](https://github.com/Unitech/pm2).

## Logging

Logging is done via winston and morgan.
Morgan logs all requests to [`./logs/access.log`](./logs/access.log) and the console stream.
Winston logs general log messages to [`./logs/error.log`](./logs/error.log) and [`./logs/combined.log`](./logs/combined.log).
The log level for winston can be set via LOG_LEVEL in [`.env`](.env)

## Testing

Testing is done via `npm run test`. Jest is used as a testing framework and supertest is used for express request testing. Make sure, that the database is reset before testing with the environment variable `RESET_DB=true`. Type validation in testing is done with zod. 
