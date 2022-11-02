FROM openjdk:11-jdk
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
RUN ./gradew bootJar

WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
EXPOSE 8082
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
ENV TZ=Asiz/Seoul
RUN apt-get install -y tzdata