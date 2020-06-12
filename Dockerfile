#Specify a base image
FROM node:alpine

#Specify a working directory
WORKDIR /app

#Copy the dependencies file
COPY package.json /app

#Install dependencies
RUN npm install 

#Copy remaining files
COPY . /app

#Default command
CMD ["npm","start"]