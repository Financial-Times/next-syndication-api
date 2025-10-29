FROM node:22-alpine

RUN apk add pandoc-cli=3.6.4-r0

WORKDIR /app
RUN chown node:node /app

USER node

ENV NODE_ENV=production

COPY --chown=node:node package*.json ./
RUN npm ci --ignore-scripts

COPY --chown=node:node . ./

CMD ["node", "--no-experimental-fetch", "--max-http-header-size=80000", "/app/server/init.js"]
