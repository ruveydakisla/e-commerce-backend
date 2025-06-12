up:
	docker compose up  -d

up-b:
	docker compose up -d --build

stop:
	docker compose stop

down:
	docker compose down

restart:
	docker compose down && docker compose up -d

## USERS
users:
	docker compose up -d --build --no-deps users-microservice

users-stop:
	docker compose stop users-microservice

users-down:
	docker compose down users-microservice

users-restart:
	docker compose restart users-microservice

products:
	docker compose up -d --build --no-deps products-microservice

products-stop:
	docker compose stop products-microservice

products-down:
	docker compose down products-microservice

products-restart:
	docker compose restart products-microservice

auth-down:
	docker compose down auth-microservice
auth-up:
	docker compose up auth-microservice
auth-restart:
	docker compose restart auth-microservice

auth:
	docker compose up -d --build --no-deps auth-microservice


api-down:
	docker compose down api-gateway

api-restart:
	docker compose restart api-gateway

api-up:
	docker compose up -d --build --no-deps api-gateway

api-gateway-up:
	docker compose up api-gateway -d

	
o-d:
	docker compose down orders-microservice

o-r:
	docker compose restart orders-microservice

o-up:
	docker compose up -d --build --no-deps orders-microservice

c-d:
	docker compose down cart-microservice

c-r:
	docker compose restart cart-microservice

c-up:
	docker compose up -d --build --no-deps cart-microservice

n-d:
	docker compose down notification-microservice

n-r:
	docker compose restart notification-microservice

n-up:
	docker compose up -d --build --no-deps notification-microservice
stock-d:
	docker compose down stock-microservice

stock-r:
	docker compose restart stock-microservice

stock-up:
	docker compose up -d --build --no-deps stock-microservice