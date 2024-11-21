FROM node
WORKDIR .

COPY package.json package-lock.json / 
RUN ["npm", "install"]

COPY src ./src

EXPOSE 8080 
CMD ["npm", "run" ,"dev"]