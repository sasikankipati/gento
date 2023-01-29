#!/usr/bin/env bash

ln -s /app/nodejs/bin/node GP-WEB/node/node 
ln -s /app/nodejs/lib/node_modules GP-WEB/node/node_modules
ln -s /app/nodejs/bin/npm  GP-WEB/node/npm

mvn clean install
