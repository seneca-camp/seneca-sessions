# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Setup

- Run `cp .env-example .env` and set your own env variables
- Run `npm install` to install all dependencies

## Development

From your terminal:

```sh
npx prisma db push
npm run db:seed
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

For production build run:

```sh
npm run build
npm start
```

## Deployment

To start the production container (with automatic updates via Watchtower), use the provided Docker Compose file:

`docker compose up --file ./docker/docker-compose.yml -d`

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
