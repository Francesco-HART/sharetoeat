rm -rf ./docker-postgresql-data-for-dev
docker-compose -f ./docker-compose-dev.yaml down --volumes
docker-compose -f ./docker-compose-dev.yaml down --remove-orphans
docker-compose -f ./docker-compose-dev.yaml up -d
