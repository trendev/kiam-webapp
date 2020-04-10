FROM node:lts-alpine as node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --  --configuration=preprod --base-href /preprod/app/

FROM nginx:alpine
LABEL maintainer="julien.sie@kiam.fr"
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ /usr/share/nginx/html/
