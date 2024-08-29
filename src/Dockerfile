FROM node:22-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install --platform=linux --arch=arm64 @ffmpeg-installer/ffmpeg
RUN npm install --force @img/sharp-linuxmusl-arm64

COPY . .

EXPOSE 3001

CMD ["npm", "start"]