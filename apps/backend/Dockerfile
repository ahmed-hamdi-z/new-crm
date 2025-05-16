FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/server.js"]