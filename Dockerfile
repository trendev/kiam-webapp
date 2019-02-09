FROM node:8.11.3 as node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build --  --prod --base-href /dist/

FROM nginx:alpine
LABEL maintainer="trendevfr@gmail.com"
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/ /usr/share/nginx/html/
