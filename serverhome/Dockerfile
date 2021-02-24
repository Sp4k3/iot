FROM node:15.9.0-alpine3.13

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install nodemon for developement
RUN npm install -g nodemon

# Bundle app source
COPY ./src ./src

# Set the command when container start running
CMD [ "npm", "run", "dev" ]