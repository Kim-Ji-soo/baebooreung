FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend
EXPOSE 8080
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/app.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"] # /app.jar -> app.jar로 변경
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
