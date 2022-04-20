FROM node:14 AS build
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm prune --production

FROM node:14
RUN npm install pm2 -g
ENV NODE_ENV production
ENV PORT 8080
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node --from=build /usr/src/app/dist /usr/src/app/dist
COPY --chown=node:node . /usr/src/app
EXPOSE 8080
CMD [ "pm2-runtime", "./dist/src/index.js" ]
