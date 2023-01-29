FROM node:16

WORKDIR /dist/app

COPY package.json package.json
RUN npm install -g npm@9.4.0
RUN npm install pm2 -g
RUN apt-get update || : && apt-get install python-pip -y || : && pip install awscli || : && apt-get install vim dnsutils -y
COPY . /app
COPY .aws /root/.aws

EXPOSE 3001
#CMD ["npm", "start"]
CMD [ "pm2-runtime", "npm run -- start" ]
#CMD [ "pm2-runtime", "start", "app.js" ]
