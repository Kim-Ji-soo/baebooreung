FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/businessService
# EXPOSE 0
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/businessService.jar
COPY ${JAR_FILE} businessService.jar
ENTRYPOINT ["java","-jar","businessService.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata