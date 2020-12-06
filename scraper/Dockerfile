FROM egalletta/papyrus-common:1.0.0-devel
RUN apk add chromium
COPY ./package*.json /app/scraper/
COPY ./tsconfig.json /app/scraper/
WORKDIR /app/scraper/
RUN npm --verbose install
COPY ./src/ /app/scraper/src/
CMD [ "npm", "run", "prod" ]
