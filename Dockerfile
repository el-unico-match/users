FROM node:21

WORKDIR /

COPY controllers/ /
COPY database/ /
COPY helpers/ /
COPY messages/ /
COPY middlewares/ /
COPY models/ /
COPY routes/ /
COPY types/ /
COPY helpers/ /
COPY package.json /
COPY index.js /

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
