# comptandye_frontend
Source of the Frontend code (Angular) + Docker configuration of the Frontend Webapp

## Serve the webapp HTTPS (localhost)
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key`
> requirement for Stripe : valid HTTPS only

## Build the webapp
> ✋ Remove the --base-href if webapp must be accessed from https://www.comptandye.fr/

`ng build --prod`

> Set the --base-href if webapp must be accessed from https://www.comptandye.fr/dist/

`ng build --prod --base-href "/dist/"`

## Build the docker image

### :recycle: *Image is automatically build on Docker Hub*

### Build the image
`docker-compose build -t trendevfr/comptandye_webapp`

### Push the image into Docker Hub
`docker push trendevfr/comptandye_webapp`

## Redeployment (with docker running with sudo user)
#### 1. stop previous container
`sudo docker stop comptandye_webapp`

#### 2. remove previous image
`sudo docker rmi trendevfr/comptandye_webapp`

#### 3. run a new container from the new image
`sudo docker run -d --rm -p 3000:80 --name comptandye_webapp trendevfr/comptandye_webapp`

### :dizzy: Execute all steps
`sudo docker stop comptandye_webapp && sudo docker rmi trendevfr/comptandye_webapp && sudo docker run -d --rm -p 3000:80 --name comptandye_webapp trendevfr/comptandye_webapp`

