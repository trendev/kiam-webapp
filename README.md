# comptandye_frontend
Source of the frontend code

## Serve HTTPS
`ng serve -o --ssl --ssl-cert ssl/server.crt --ssl-key ssl/server.key` 

## Build and move to the backend sources
`ng build --prod --base-href "/dist/" && rm -rf ~/comptandye_backend/comptandye/src/main/webapp/dist && mv dist ~/comptandye_backend/comptandye/src/main/webapp/`
