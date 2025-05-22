FROM node:20-alpine

WORKDIR /usr/src/app/cart-microservice

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./cart-microservice
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
