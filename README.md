# Backmind

Welcome to the backend repository for our innovative educational AI project, [Whitemind](https://github.com/Neurologism/whitemind)! Our goal is to empower users to build artificial intelligence systems using a visual, block-based interface similar to Scratch or LEGO, making AI development accessible and fun for everyone.

## Table of Contents

Already know where you're going? We've got you covered.

- [What is Whitemind ?](#what-is-whitemind)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Configuration](#q)
- [Documentation](#documentation)
- [Logging](#logging)

## What is Whitemind?

[Whitemind](https://github.com/Neurologism/whitemind) is designed to simplify the process of creating and experimenting with AI models by using a modular, block-based approach. This method enables users to construct complex AI systems intuitively, without needing deep programming knowledge. Our platform provides an engaging and interactive way to learn about AI and machine learning by manipulating blocks that represent different components and functions.

## Technical Stack

The backend of Whitemind is built using a modern and robust technology stack, ensuring scalability, performance, and ease of development:

### Node.js

Node.js is an open-source, cross-platform runtime environment that enables server-side scripting using JavaScript. It is designed to build scalable network applications with high performance. Node.js operates on a single-threaded, event-driven architecture, which allows it to handle numerous concurrent connections efficiently.

### Express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building server-side applications by offering a straightforward API for routing, middleware integration, and handling HTTP requests.

### TypeScript

TypeScript is a statically typed superset of JavaScript developed by Microsoft that adds optional static types and type-checking to the language. By compiling TypeScript code into plain JavaScript, it enhances code quality and maintainability, catching errors during development rather than runtime.

### PM2

PM2 is a production process manager for Node.js applications that simplifies the deployment, monitoring, and management of applications. It provides features such as process management, load balancing, and automatic restarts, ensuring that applications run smoothly and reliably in production environments.

### Swagger

Swagger (now known as OpenAPI) is a framework for API documentation and development that helps design, build, document, and consume RESTful web services. Swagger provides a standardized format for describing APIs.

## Installation

### 1. Install Required Tools

You can either install Node using your package manager or using [this convenient helper](https://nodejs.org/en/download/package-manager) if you haven't installed it already. Afterwards, verify that you've installed Node.js and npm by running:

```bash
node -v # should print something like `v.20.17.0`
npm -v # should print something like `v.10.8.2`
```

### 2. Installing MongoDB

To proceed, you need to install MongoDB Community Edition on your local machine. MongoDB offers official installation guides based on your operating system. Follow the instructions for your platform to ensure a correct setup. Select the appropriate tutorial from the list below:

| Platform | Link                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Linux    | [Red Hat or CentOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/) <br> [Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/) <br> [Debian](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-debian/) <br> [SUSE](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-suse/) <br> [Amazon Linux](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-amazon/) |
| maxOS    | [macOS]()                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Windows  | [Windows]()                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Docker   | [Docker]()                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### 3. Cloning the Backmind Repository

Navigate to or create a directory where you want to store backmind and run the following commands. Remember to insert your MongoDB login data into the `MONGO_URI` environment variable.

```bash
git clone https://github.com/SirPythonPhoenix/backmind.git
cd backmind
npm install
echo "MONGO_URI='mongodb://user:password@localhost:27017'" >> .env
```

### Running for Developement

Use the following npm scripts for developement.

```bash
npm run pretty # formats the code
npm test # test the code

npm run dev # to start an express server
```

### Running for Deployment

Use the following npm scripts for developement.

```bash
npm run build # nuilds type script into java script code

npm run start # starts the express server
npm run stop # stops the express server
```

As backmind uses pm2, it is possible to use the full array of pm2 commands. To do so, make sure you've installed pm2 globally `npm i -g pm2` (or use npx). For instance, this would make it possible to use `pm2 start dist/index.js -i 0` to use the pm2 load balancer on all available cores on a dedicated server. You can find more [here](https://github.com/Unitech/pm2).

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
NODE_ENV="developement"
```

Example server configuration:

```bash
# /.env
MONGO_URI='mongodb://user:password@hostname:port'
JWT_TOKEN_EXPIRE_IN="100h" # for users to keep logged in for a few days via cookies
DB_NAME="backmind"
LOG_LEVEL="info"
NODE_ENV="production"
```

## Documentation

Documentation is generated using swagger and can be accessed at `hostname/api-docs`.
The swagger documentation is generated from the [`swagger.ts`](/src/swagger.ts) file.

## Logging

Logging is done via winston and morgan.
Morgan logs all requests to [`./logs/access.log`](./logs/access.log) and the console stream.
Winston logs to [`./logs/error.log`](./logs/error.log) and [`./logs/combined.log`](./logs/combined.log).
The log level for winston can be set via LOG_LEVEL in [`.env`](.env)
