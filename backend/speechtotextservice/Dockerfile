# 파이썬 이미지를 기반으로 함
FROM python:3.8

COPY . .
RUN pip3 install flask
RUN pip3 install pyaudio
RUN pip3 install --upgrade google-cloud-storage
RUN pip3 install google-cloud-speech

VOLUME /tmp

EXPOSE 5000

CMD python ./app.py