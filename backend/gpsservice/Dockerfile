FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/gpsservice
VOLUME /tmp
EXPOSE 8083
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
