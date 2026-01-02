FROM node:22-alpine

RUN apk add pandoc-cli=3.8.2.1-r0
RUN apk add postgresql17-client=17.7-r0 # Provides pg_dump for database backup worker process

WORKDIR /app
RUN chown node:node /app

USER node

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts

COPY --chown=node:node . ./

CMD ["node", "--no-experimental-fetch", "--max-http-header-size=80000", "/app/server/init.js"]
