FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/userservice
# EXPOSE 0
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/userService.jar
COPY ${JAR_FILE} userService.jar
ENTRYPOINT ["java","-jar","userService.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
