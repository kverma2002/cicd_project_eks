FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# RUN npm install --platform=linux --arch=arm64 @ffmpeg-installer/ffmpeg
# RUN npm install --force @img/sharp-linuxmusl-arm64

COPY . .

EXPOSE 8001

CMD ["npm", "start"]