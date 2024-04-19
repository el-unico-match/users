FROM node:21

WORKDIR /
COPY controllers/ controllers/
COPY database/ database/
COPY helpers/ helpers/
COPY messages/ messages/
COPY middlewares/ middlewares/
COPY models/ models/
COPY routes/ routes/
COPY types/ types/
COPY .env /.env
COPY index.js /index.js
COPY package.json /package.json

RUN npm install

EXPOSE 4000

ENTRYPOINT [ "node", "index.js"]
