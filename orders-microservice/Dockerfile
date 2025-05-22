FROM node:20-alpine

WORKDIR /usr/src/app/orders-microservice

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./orders-microservice
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
