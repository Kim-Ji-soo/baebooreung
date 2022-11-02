FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x ./gradlew
CMD ["./gradlew", "clean", "build"]
RUN ./gradlew bootJar
COPY --from=builder build/libs/*.jar app.jar
EXPOSE 8082
VOLUME /tmp
ENTRYPOINT ["java", "-jar", "/app.jar"]
ENV TZ=Asiz/Seoul
RUN apt-get install -y tzdata