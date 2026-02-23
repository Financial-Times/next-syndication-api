FROM node:22-alpine

# Provides pg_dump for database backup worker process
RUN apk add --no-cache pandoc-cli postgresql17-client

WORKDIR /app
RUN chown node:node /app

USER node

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts

COPY --chown=node:node . ./

CMD ["node", "--no-experimental-fetch", "--max-http-header-size=80000", "/app/server/init.js"]
