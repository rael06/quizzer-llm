# Install dependencies and build the common package
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 3099
