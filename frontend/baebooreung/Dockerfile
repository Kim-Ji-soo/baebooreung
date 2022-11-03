FROM node:16.17.0 as build-stage
WORKDIR /var/jenkins_home/workspace/baebooreung/frontend/baebooreung
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /var/jenkins_home/workspace/baebooreung/frontend/baebooreung/build usr/share/nginx/html
COPY --from=build-stage /var/jenkins_home/workspace/baebooreung/frontend/baebooreung/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /var/jenkins_home/workspace/baebooreung/frontend/baebooreung/fullchain3.pem /etc/letsencrypt/live/k7c207.p.ssafy.io/fullchain3.pem

EXPOSE 80
ENTRYPOINT ["nginx", "-g","daemon off;"]
