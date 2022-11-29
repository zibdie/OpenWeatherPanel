#Use the smallest image possible
FROM node:alpine

#Heroku ignores these anyway
ENV PORT 5003

#Remove or comment out the line below to test locally [using an .env file]
ENV NODE_ENV production

EXPOSE 5003

WORKDIR /app

#Copy package.json first so we can cache the install
COPY package.json .

RUN npm install

COPY . .

CMD node server.js
