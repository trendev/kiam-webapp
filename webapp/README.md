# comptandye_frontend
Source of the Frontend code (Angular)

## Serve the webapp HTTPS (localhost)
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key`
> requirement for Stripe : valid HTTPS only

## Build and update the Backend sources
> ✋ Remove the --base-href : users will get a direct access to the root folder

`ng build --prod && rm -rf ~/github/comptandye_webapp/dist && mv dist ~/github/comptandye_webapp/`

> when the webapp does not have to be accessed from root folder

`ng build --prod --base-href "/dist/" && rm -rf ~/github/comptandye_webapp/dist && mv dist ~/github/comptandye_webapp/`
