FROM node:20.9.0

RUN mkdir /server

WORKDIR /server

COPY . /server

RUN npm install
CMD npm run start