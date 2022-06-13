FROM node:16.13.0
WORKDIR /

COPY ./package.json /
RUN npm install --loglevel verbose

COPY ./ /
RUN npm run build

EXPOSE 4000

ENV NUXT_HOST=0.0.0.0

ENV NUXT_PORT=4000

CMD [ "npm", "start" ]
