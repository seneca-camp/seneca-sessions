FROM node:alpine AS builder

WORKDIR /app/

COPY ./ .

ENV DATABASE_URL="file:/appdb/db.sqlite"

RUN npm ci && \
    npm run db:generate && \
    npm run build

FROM node:alpine

WORKDIR /app/

COPY --from=builder /app/build ./build/
COPY --from=builder /app/package.json /app/package-lock.json ./

RUN apk add sqlite && \
    npm ci --omit=dev --omit=optional

ENV DATABASE_URL="file:/appdb/db.sqlite"
ENV NODE_ENV=production

CMD ["npm", "run", "start"]
