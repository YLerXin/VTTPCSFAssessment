FROM node:23 AS ng-build

WORKDIR /src

RUN npm i -g @angular/cli

#COPY client/public public
COPY client/src src
COPY client/*.json .

RUN npm ci && ng build

FROM openjdk:23-jdk AS j-build

WORKDIR /src

COPY server/.mvn .mvn
COPY server/src src
COPY server/mvnw .
COPY server/pom.xml .
#Look for "outputPath" under "architect" → "build" → "options".
COPY --from=ng-build /src/dist/client/* src/main/resources/static

RUN chmod a+x mvnw && ./mvnw package -Dmaven.test.skip=true

FROM openjdk:23-jdk 
WORKDIR /app
COPY --from=j-build /src/target/server-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=3000
##the ENV was Here
EXPOSE ${PORT}

SHELL [ "/bin/sh", "-c" ]
ENTRYPOINT SERVER_PORT=${PORT} java -jar app.jar
