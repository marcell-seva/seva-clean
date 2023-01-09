FROM node:16-alpine as builder

LABEL org.opencontainers.image.authors="Samsul Ma'arif <samsul@dot-indonesia.com>"

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .
RUN npm run export

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/out /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
