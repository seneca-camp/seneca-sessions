FROM node:latest as base

WORKDIR /app/

RUN apt-get update && apt-get install -y openssl sqlite3

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --legacy-peer-deps

ENV DATABASE_URL="file:/appdb/db.sqlite"

ADD prisma ./prisma
RUN npx prisma generate

COPY ./ .

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "run", "start"]