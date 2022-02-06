FROM node:latest as builder
WORKDIR /usr/app
COPY package.json .
RUN [ "npm", "install" ]
COPY . .
CMD [ "npm", "run", "build" ]

FROM node:latest
WORKDIR /usr/app
COPY --from=builder /usr/app/package.json ./package.json
RUN [ "npm", "install" ]
COPY --from=builder /usr/app/build ./build
CMD [ "npm", "start" ]