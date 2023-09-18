FROM node:latest as base

WORKDIR /app/

RUN apt-get update && apt-get install -y openssl sqlite3

COPY ./package.json ./

RUN npm install

ENV DATABASE_URL="file:/appdb/production.db"

ADD prisma ./prisma
RUN npx prisma generate

COPY ./ .

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "run", "start"]