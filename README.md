# comptandye_frontend
Source of the Frontend code (Angular)

## Serve the webapp HTTPS (localhost)
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key` 
> requirement for Stripe : valid HTTPS only

## Build and update to the backend sources
`ng build --prod --base-href "/dist/" && rm -rf ~/comptandye_backend/comptandye/src/main/webapp/dist && mv dist ~/comptandye_backend/comptandye/src/main/webapp/`
