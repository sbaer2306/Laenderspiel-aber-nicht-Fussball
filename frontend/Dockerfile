FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]