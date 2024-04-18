FROM node:21

COPY [".", ".env", "package.json","package-lock.json" , "/usr/src/"]

WORKDIR /usr/src

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
