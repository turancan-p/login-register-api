FROM node:lts
WORKDIR /home/raaizel/Desktop/git-repositories/login-register-api
COPY package*.json ./
RUN npm install
RUN npm run build
COPY . .
EXPOSE 3001

CMD [ "npm", "run", "start" ]
