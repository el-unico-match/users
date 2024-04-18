FROM node:21

COPY controllers/ src/
COPY database/ src/
COPY helpers/ src/
COPY mesages/ src/
COPY middlewares/ src/
COPY models/ src/
COPY routes/ src/
COPY types/ src/
COPY helpers/ src/
COPY .env src/
COPY .package.json src/
COPY index.js sec/

WORKDIR /src/

RUN npm install

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]
