# Backmind

Backmind is the API backend for the Whitemind product. It is built with
NestJS, Fastify, and MongoDB and provides authentication, projects, tasks,
tutorials, and user features.

## Quick start

```sh
pnpm install
pnpm dev
```

The server starts on `http://localhost:3000` by default.

## Requirements

- Node.js 20+ (LTS recommended)
- pnpm
- MongoDB (Atlas or local)

## Configuration

Backmind reads configuration from `.env`. Use the values below as a starting
point and update secrets for your environment.

```sh
# Core
MONGO_URI=mongodb://user:password@host
DB_NAME=backmind-dev
NODE_ENV=development
HOST=0.0.0.0
PORT=3000

# Auth
JWT_SECRET=change_me
JWT_TOKEN_EXPIRE_IN=24h
SECRET_KEY=change_me
SALT_ROUNDS=10
MIN_PASS_LENGTH=6

# Account / limits
VERIFY_ALL_EMAILS=true
DISABLE_ACCOUNT_CREATION=false
MAX_TOKENS=5
RATE_LIMIT_DURATION=5
RATE_LIMIT_REQUESTS=1000

# Email / notifications
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_VERIFICATION_TOKEN_VALID_MINUTES=60

# App URLs
BACKMIND_HOSTNAME=http://localhost:3000/
WHITEMIND_HOSTNAME=http://localhost:8000/

# Files
FILES_DIRECTORY=./dataStorage
PFP_DIRECTORY=./dataStorage/pfp
MODEL_DIRECTORY=./dataStorage/model

# Logging
LOG_LEVEL=debug
DISCORD_LOGGING=true
SEND_ERR_TO_CLIENT=true

# Dev helpers
RESET_DB=
WRITE_PROJECT_JSON=false
```

Notes:

- `SECRET_KEY` is used by `@fastify/secure-session` and must decode to 32 bytes
  if provided as base64.
- `JWT_SECRET` and `SECRET_KEY` should be unique per environment.

## Common scripts

```sh
pnpm dev           # Run in watch mode
pnpm build         # Build to dist/
pnpm test          # Run tests
pnpm lint          # Lint and auto-fix
pnpm dropDb        # Drop the database (see scripts/dropDb.js)
pnpm createTutorials  # Seed tutorials (requires TutorMind data)
```

## Seeding tutorials

Tutorial data lives in the `TutorMind` submodule. Ensure it is available
before running:

```sh
pnpm createTutorials
```

If the submodule is private, clone it with appropriate credentials.

## Deployment

GitHub Actions workflows live in `.github/workflows/` and deploy via SSH by
running the scripts in `scripts/`.

- `scripts/deployMainNestjs.sh`
- `scripts/deployDevNestjs.sh`

These scripts install dependencies, build, and restart the server.

## Tech stack

- NestJS
- Fastify
- Mongoose
- JWT auth
- SendGrid

## License

UNLICENSED
