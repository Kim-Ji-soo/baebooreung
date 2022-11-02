FROM openjdk:11-jdk
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/producerservice
VOLUME /tmp
EXPOSE 8082
ARG JAR_FILE=build/libs/app.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"]
ENV TZ=Asia/Seoul
RUN apt-get install -y tzdata
