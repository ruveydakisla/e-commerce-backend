FROM node:20-alpine

WORKDIR /usr/src/app/api-gateway

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./api-gateway
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
