FROM egalletta/papyrus-common:1.0.0-devel
COPY ./package.json /app/server/
COPY ./tsconfig.json /app/server/
WORKDIR /app/server/
RUN npm install
COPY ./src/ /app/server/src/
EXPOSE 5000
CMD [ "npm", "run", "prod" ]
