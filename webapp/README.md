# comptandye_frontend
Source of the Frontend code (Angular)

## Serve the webapp HTTPS (localhost)
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key` 
> requirement for Stripe : valid HTTPS only

## Build and update the Backend sources
> ✋ Remove the --base-href : users will get a direct access to the root

> TODO 🤔 : update the destination folder with the new github repository for comptandye_webapp

`ng build --prod --base-href "/dist/" && rm -rf ~/comptandye_backend/comptandye/src/main/webapp/dist && mv dist ~/comptandye_backend/comptandye/src/main/webapp/`

### In comptandye_webapp folder

#### Build the image
`docker-compose build`

#### Push the image into Docker Hub
`docker push trendevfr/comptandye_webapp`

### On host srvapp01 
#### 1. stop previous container
#### 2. remove previous image
#### 3. run a new container from the new image
`sudo docker stop comptandye_webapp && sudo docker rmi trendevfr/comptandye_webapp && sudo docker run -d --rm -p 3000:80 --name comptandye_webapp trendevfr/comptandye_webapp`
