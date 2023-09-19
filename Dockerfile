#Use the smallest image possible - Pin a working version of node:alpine
FROM node@sha256:923cd6fac65f6892aa8bbb4208ad708c56b35f9ab86eca07ccc7b56dd28c9c77

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
