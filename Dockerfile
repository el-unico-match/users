FROM node:21

COPY controllers/ src/
COPY database/ src/
COPY helpers/ src/
COPY messages/ src/
COPY middlewares/ src/
COPY models/ src/
COPY routes/ src/
COPY types/ src/
COPY helpers/ src/
COPY package.json src/
COPY index.js src/

WORKDIR /src/

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
