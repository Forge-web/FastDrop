# Этап 1: Установка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Этап 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Этап 3: Запуск в продакшене
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Безопасность: создаем не-root пользователя
RUN addgroup --system --gid 1001 nuxtjs && \
    adduser --system --uid 1001 nuxtjs

# Копируем результат сборки и production-зависимости
COPY --from=builder --chown=nuxtjs:nuxtjs /app/.output ./.output
COPY --from=deps --chown=nuxtjs:nuxtjs /app/node_modules ./node_modules

USER nuxtjs

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

# Запуск сервера Nitro
CMD ["node", ".output/server/index.mjs"]