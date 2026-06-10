FROM node:24-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json ./

RUN npm install

COPY . .
ENV VITE_API_URL=http://localhost:5000/api

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80








