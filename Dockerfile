FROM node:16-alpine  as dependencies
WORKDIR /my-project
COPY package.json package-lock.json ./
RUN npm install  --frozen-lockfile --force

FROM node:16-alpine  as builder
WORKDIR /my-project
COPY . .
COPY --from=dependencies /my-project/node_modules ./node_modules
RUN npm run build

FROM node:16-alpine  as runner
WORKDIR /my-project
ENV NODE_ENV production

COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /my-project/public ./public
COPY --from=builder /my-project/.next ./.next
COPY --from=builder /my-project/node_modules ./node_modules
COPY --from=builder /my-project/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]