FROM node:18-alpine AS base

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install 

COPY src ./src

RUN npm run build

CMD [ "npm", "start" ]