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
COPY .env /
COPY index.js /
COPY package.json /

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node", "index.js"]
