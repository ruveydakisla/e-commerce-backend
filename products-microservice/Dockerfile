FROM node:20-alpine

WORKDIR /usr/src/app/products-microservice

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./products-microservice
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
