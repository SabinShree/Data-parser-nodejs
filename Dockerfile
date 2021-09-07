# using node image file for running this app
FROM node:15.5-alpine

# creating Login-Api folder in container
WORKDIR /smtm-news-parser-Api

# concept of caching. use package.json if it is not present.
ADD package*.json ./

RUN npm install
# Adding all file from project local directory to docker container
ADD . .
EXPOSE 4014
# Running command line 'npm start'
CMD ["npm", 'start']

