FROM node:16.13.2-alpine

WORKDIR /client
ADD client ./
RUN npm install
RUN npm run build

WORKDIR /server
ADD server ./
RUN npm install
CMD node server.js