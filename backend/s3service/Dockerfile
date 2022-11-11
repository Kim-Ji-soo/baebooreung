FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/s3Service
# EXPOSE 0
CMD ["./gradlew", "clean", "build"]
VOLUME /tmp
ARG JAR_FILE=build/libs/s3Service.jar
COPY ${JAR_FILE} s3Service.jar
ENTRYPOINT ["java","-jar","s3Service.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata