## Validate event entrance

1. generate proof
2. scan proof with this app
3. wait result.
4. Allow entrance or not.


## How to?

0. build app ```npm run build```
1. launch the app ```npm run start```
2. Add your brand public key as query param http://localhost:3000/scan/0x4fB553C63ee6d4db2F7599eAEFCf831fD8e0929a/mainnet
3. Scan and allow entrance

Be carefull, to use camera, smartphone and desktop need to be in SSL.
During development, it could be complicated on localhost.
The best is to use ngrok and link it to you http://localhost:3000

## Online :
https://verif.arianee.org/scan/0x4fB553C63ee6d4db2F7599eAEFCf831fD8e0929a/mainnet?Digital
(check arianee demo passport)

## Allow entrance
![alt text](https://raw.githubusercontent.com/stefdelec/arianee-event-scanner/master/public/img/scvalid.png)

## Not Allow entrance
![alt text](https://raw.githubusercontent.com/stefdelec/arianee-event-scanner/master/public/img/scunvalid.png)
