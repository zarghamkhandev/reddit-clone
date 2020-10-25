FROM node:12

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci
RUN npm run build

COPY . .

EXPOSE 8080

CMD ["node","dist/index.js"]