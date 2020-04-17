#Use the smallest image possible
FROM node:alpine

WORKDIR /app

#Copy package.json first so we can cache the install
COPY package.json .

RUN npm install

COPY . .

CMD node server.js