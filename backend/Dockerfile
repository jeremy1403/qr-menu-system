FROM node:20-alpine

# cache bust 2
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/src/main.js"]