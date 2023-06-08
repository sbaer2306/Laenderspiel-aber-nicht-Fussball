FROM node:20-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

COPY . /app

RUN npm i nodemon -g

RUN npm install express --save

RUN npm install node-cache

RUN npm install express-session

RUN npm install

RUN npx prisma generate

CMD ["npm", "start"]
