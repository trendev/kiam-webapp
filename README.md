# comptandye_frontend
Source of the Frontend code (Angular) + Docker configuration of the Frontend Webapp

## Serve the webapp HTTPS (localhost)
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key`
> requirement for Stripe : valid HTTPS only

## Build the webapp

### Production

> Set the --base-href if webapp must be accessed from https://www.comptandye.fr/dist/

`ng build --prod --base-href "/dist/"`

> ✋ Remove the --base-href if webapp must be accessed from https://www.comptandye.fr/

`ng build --prod`

## Build the docker image

### :recycle: *Image is automatically build on Docker Hub*

### Build the image
`docker build -t trendev/comptandye_webapp .`

### Push the image into Docker Hub
`docker push trendev/comptandye_webapp`

## Redeployment (with docker running with sudo user)
#### 1. stop previous container
`sudo docker stop comptandye_webapp`

#### 2. remove previous image
`sudo docker rmi trendev/comptandye_webapp`

#### 3. run a new container from the new image
`sudo docker run -d --rm -p 3000:80 --name comptandye_webapp trendev/comptandye_webapp`

### :dizzy: Execute all steps
`sudo docker stop comptandye_webapp && sudo docker rmi trendev/comptandye_webapp && sudo docker run -d --rm -p 3000:80 --name comptandye_webapp trendev/comptandye_webapp`

