# First Stage : to install and build dependences
FROM node:16.10.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Second Stage : Setup command to run your app using lightweight node image
FROM node:16.10.0-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8000
CMD ["node", "dist/main"]