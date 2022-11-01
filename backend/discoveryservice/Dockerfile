FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/discoveryservice
EXPOSE 8761
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/DiscoveryService.jar
COPY ${JAR_FILE} DiscoveryService.jar
ENTRYPOINT ["java","-jar","DiscoveryService.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
