#!/bin/sh

git pull
npm i
npm run build

pm2 delete terraza_be
pm2 save
pm2 start dist/main.js --name terraza_be
pm2 save