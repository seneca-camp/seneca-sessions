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
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/prisma.config.ts /app/package.json /app/package-lock.json /app/startup.sh ./

RUN apk add sqlite && \
    npm ci --omit=dev --omit=optional && \
    mkdir -p /appdb && \
    chown node:node /appdb

VOLUME ["/appdb"]

ENV DATABASE_URL="file:/appdb/db.sqlite"
ENV NODE_ENV=production

USER node

CMD ["sh", "startup.sh"]
