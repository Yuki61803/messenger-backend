FROM node:lts-alpine as builder
WORKDIR /app
COPY package.json package-lock.json migrations ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations
COPY package.json package-lock.json migrations ./
RUN npm install --production