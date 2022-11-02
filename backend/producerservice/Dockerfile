FROM openjdk:11-jdk AS builder
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
VOLUME /tmp
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradlew clean build
RUN ./gradlew bootJar

FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
VOLUME /tmp
COPY --from=builder build/libs/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
ENV TZ=Asiz/Seoul
RUN apt-get install -y tzdata