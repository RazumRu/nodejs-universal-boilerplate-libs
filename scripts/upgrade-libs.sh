#!/bin/bash

npm i -g npm-check-updates

ncu -u
for dir in packages/*; do (cd $dir && ncu -u -x @packages/*); done
yarn install
