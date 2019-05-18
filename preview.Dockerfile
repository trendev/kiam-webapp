FROM node:8-alpine as node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --  --prod —-base-href /preview/

FROM nginx:alpine
LABEL maintainer="julien.sie@comptandye.fr"
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ /usr/share/-/html/
