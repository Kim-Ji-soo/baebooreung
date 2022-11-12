# 파이썬 이미지를 기반으로 함
FROM python:3.8
WORKDIR /var/jenkins_home/workspace/speechtotext-service/backend/speechtotextservice
COPY . .
RUN pip3 install flask
RUN pip3 install --upgrade google-cloud-storage
RUN pip3 install google-cloud-speech
RUN pip3 install moviepy


EXPOSE 5000

CMD python3 ./app.py