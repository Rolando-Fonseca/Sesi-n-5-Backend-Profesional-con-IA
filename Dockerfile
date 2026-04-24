FROM node:18-alpine

RUN apk add --no-cache openssl

# Build args from Easypanel
ARG NODE_ENV=production
ARG PORT=3000
ARG CORS_ORIGIN=*
ARG DATABASE_URL
ARG JWT_SECRET
ARG JWT_EXPIRATION=1h
ARG JWT_REFRESH_SECRET
ARG JWT_REFRESH_EXPIRATION=7d
ARG APP_NAME="Restaurants API"
ARG APP_VERSION=1.0.0
ARG APP_DESCRIPTION="Complete restaurant management REST API"
ARG LOG_LEVEL=info

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

RUN npx prisma generate
RUN nest build

# Set runtime env vars AFTER build so npm install includes devDependencies
ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT \
    CORS_ORIGIN=$CORS_ORIGIN \
    DATABASE_URL=$DATABASE_URL \
    JWT_SECRET=$JWT_SECRET \
    JWT_EXPIRATION=$JWT_EXPIRATION \
    JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET \
    JWT_REFRESH_EXPIRATION=$JWT_REFRESH_EXPIRATION \
    APP_NAME=$APP_NAME \
    APP_VERSION=$APP_VERSION \
    APP_DESCRIPTION=$APP_DESCRIPTION \
    LOG_LEVEL=$LOG_LEVEL

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm run start:prod"]
