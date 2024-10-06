FROM node:18-bullseye AS base

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install 

COPY src ./src

RUN npm run build

CMD [ "npm", "start" ]