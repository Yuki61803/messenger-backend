FROM node:lts-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:lts-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]