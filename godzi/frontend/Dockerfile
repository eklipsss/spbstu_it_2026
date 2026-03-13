FROM node:20.14.0-alpine3.20 AS base

FROM base AS builder
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.27
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80