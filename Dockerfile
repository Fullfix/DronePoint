FROM node:12

WORKDIR .

COPY package*.json ./

# RUN npm install -g nodemon

RUN npm install

COPY . .

RUN npm install --prefix client

RUN npm run build --prefix client

EXPOSE 2000

CMD [ "node", "index.js" ]