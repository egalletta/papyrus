FROM egalletta/latest
COPY ./package.json /app/server/
COPY ./tsconfig.json /app/server/
WORKDIR /app/server/
RUN npm install
COPY ./src/ /app/server/src/
EXPOSE 80
CMD [ "npm", "run", "prod" ]
