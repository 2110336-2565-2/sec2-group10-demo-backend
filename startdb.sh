#!/bin/bash

docker-compose up -d

sleep 15

docker exec -u root mongo1 /scripts/rs-init.sh

# docker exec -u root mongo1 /scripts/init-user-db.sh