FROM node:20-alpine

# cache bust
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main.js"]