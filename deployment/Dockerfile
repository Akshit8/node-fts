FROM node:14-alpine

WORKDIR /app

COPY bin ./bin
COPY fixtures ./fixtures
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]