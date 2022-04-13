FROM node:12.18-alpine

LABEL mantainer="Andre Carvalho <afacarvalho@yahoo.com.br>"

WORKDIR /app

COPY ./package.json .
ENV NPM_CONFIG_LOGLEVEL warn

# Install app dependencies
RUN npm install \
&& npm install pm2 -g \
&& pm2 install pm2-server-monit \
&& pm2 install pm2-logrotate

COPY ./src .
COPY ./pm2.json .
COPY ./LICENSE .

ENV PORT 9000
EXPOSE 9000
#ENV CONF_PATH /data/conf
#VOLUME ["${CONF_PATH}","/logs"]
VOLUME ["/data/logs"]
CMD ["pm2-runtime", "--env", "production", "start", "pm2.json"]