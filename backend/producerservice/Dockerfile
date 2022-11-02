FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
VOLUME /tmp
COPY build/libs/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
ENV TZ=Asiz/Seoul
RUN apt-get install -y tzdata