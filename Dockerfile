FROM node:14
WORKDIR /code
COPY . .
RUN npm install
#RUN yarn build
ENV NODE_OPTIONS="--max-old-space-size=8192"
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
