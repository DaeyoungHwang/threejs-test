FROM node:16 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . ./
EXPOSE 22222

CMD ["npm", "start"]