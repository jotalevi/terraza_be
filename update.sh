#!/bin/sh

git pull
npm i
npm run build

pm2 delete terraza_be
pm2 save
pm2 npm run start:prod --name terraza_be --spa
pm2 save