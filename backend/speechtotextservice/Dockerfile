# 파이썬 이미지를 기반으로 함
FROM python:3.8
WORKDIR /var/jenkins_home/workspace/baebooreung/backend/speechtotextservice
COPY . .
RUN pip3 install flask
RUN pip3 install --upgrade google-cloud-storage
RUN pip3 install google-cloud-speech


EXPOSE 5000

CMD python3 ./app.py