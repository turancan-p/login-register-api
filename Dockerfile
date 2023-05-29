FROM node:lts
WORKDIR /home/raaizel/Desktop/git-repositories/login-register-api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001

CMD [ "npm", "run", "dev" ]
