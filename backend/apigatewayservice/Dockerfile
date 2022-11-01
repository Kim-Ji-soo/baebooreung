FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/apigatewayservice
EXPOSE 8000
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/apigatewayService.jar
COPY ${JAR_FILE} apigatewayService.jar
ENTRYPOINT ["java","-jar","apigatewayService.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
