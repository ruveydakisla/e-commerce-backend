FROM node:20-alpine

WORKDIR /usr/src/app
COPY ./libs ./libs
COPY ./shipping-microservice ./shipping-microservice
WORKDIR /usr/src/app/shipping-microservice
RUN npm install
CMD ["npm", "run", "start:dev"]