#!/bin/bash
docker rm --force ps 
docker build --tag peer-broker-server . 
docker run --publish 9000:9000 --detach --name ps peer-broker-server 