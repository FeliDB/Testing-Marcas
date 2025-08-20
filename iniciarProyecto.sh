#!/bin/bash

# Levantar los contenedores con docker-compose
docker-compose up &

# Guardar el PID del proceso docker-compose
DOCKER_PID=$!

# Esperar unos segundos para que docker-compose inicie los servicios
sleep 5

# Ejecutar el comando nest start
nest start

# Opcional: si quieres que cuando nest termine también se detenga docker-compose, puedes usar:
# kill $DOCKER_PID
