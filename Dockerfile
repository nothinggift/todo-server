# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制剩余的应用代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 从构建阶段复制构建好的资产
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 暴露应用运行的端口（NestJS 默认为 3000）
EXPOSE 3000

# 启动应用
CMD ["pnpm", "start:prod"]