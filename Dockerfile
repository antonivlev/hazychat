FROM node:current-slim

RUN npm install peer -g

EXPOSE 9000

CMD peerjs --port 9000 --key peerjs --path /myapp

