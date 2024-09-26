FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm run build
RUN pnpm prune --prod
# ---

FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/server.js"]