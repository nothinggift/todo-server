FROM node:20-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .
RUN npx prisma generate \
    && npm run build \
    && npm prune --omit=dev

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/server.js"]