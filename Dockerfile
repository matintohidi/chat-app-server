FROM node:20-bullseye

WORKDIR /chat-app-server

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 1338

CMD ["yarn", "start:prod"]
