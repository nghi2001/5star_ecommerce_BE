FROM node:16-alpine
WORKDIR /home/app
COPY ./package.json .
RUN npm install --force
COPY . .
EXPOSE 3001
RUN npm install -g @nestjs/cli@8.0.0
RUN npm run build
RUN npm install --force --omit=dev
CMD ["npm","run","start:prod"]