FROM node:20-alpine

WORKDIR /usr/src/app
COPY ./libs ./libs
COPY ./notifications-microservice ./notifications-microservice
WORKDIR /usr/src/app/notifications-microservice
RUN npm install
CMD ["npm", "run", "start:dev"]