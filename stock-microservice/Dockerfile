FROM node:20-alpine

WORKDIR /usr/src/app
COPY ./libs ./libs
COPY ./stock-microservice ./stock-microservice
WORKDIR /usr/src/app/stock-microservice
RUN npm install
CMD ["npm", "run", "start:dev"]