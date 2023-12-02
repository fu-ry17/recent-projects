pull:
	docker pull postgres:15-alpine

postgresinit:
	docker run --name postgres15 -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=kali -d postgres:15-alpine

create-db:  # create the database
	docker exec -it postgres15 createdb --username=root --owner=root axum-crud

db:  # access the database
	docker exec -it postgres15 psql

.PHONY: pull postgresinit create-db db
