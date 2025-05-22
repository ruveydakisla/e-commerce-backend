FROM node:20-alpine

WORKDIR /usr/src/app/auth-microservice

# Burada artık sadece '.' içindeki dosyaları alıyoruz çünkü context ./auth-microservice
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
