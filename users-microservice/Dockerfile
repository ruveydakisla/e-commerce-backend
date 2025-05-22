FROM node:20-alpine

WORKDIR /usr/src/app/users-microservice

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./users-microservice
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
