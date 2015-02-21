FROM dockerfile/nodejs:latest

ADD . /app
WORKDIR /app

RUN npm install

ENV NAME world

EXPOSE 80

CMD ["node", "server.js"]