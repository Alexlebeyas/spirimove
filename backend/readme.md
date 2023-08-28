# Spiri-Move Django backend

## Project setup

### Clone Project

```
git clone git@ssh.dev.azure.com:v3/SpiriaDigital-Canada/Spiri-Move_ZoneProject/Spiri-Move_ZoneProject
```

### Create your local environment

```sh
cd backend
cp .env.sample .env
```

### Build docker containers

- You will need to install docker (with docker-compose) first.
- If you have a postgres server running locally, stop it or change it so it runs on another port than 5432
- Build the containers

```
docker-compose build
```

### Start containers

Your `backend` folder will be mounted in the docker image at `/spiri_move`.

```
docker-compose up
```

### Run migrations

First, open a new terminal while the project is running in the main terminal

```
docker exec -it backend-web-1 bash
python manage.py makemigrations
python manage.py migrate
```

### First time setup

Create a superuser to access the administration interface.
When asked for an email address/password, enter any valid value, but remember it as it will be useful later.

```
docker exec -it backend-web-1 bash
python manage.py createsuperuser
```

Connect to the [Django admin](https://127.0.0.1:8000/admin) and finish the setup.

- Go to Users, select the superuser and assign him the "Admin" Role
- Create a contest
- Create the levels for the rewards of the contest

### API Documentation:

The API documentation is available as a [Swagger OpenAPI](https://127.0.0.1:8000/) static site.

## Development workflow

### Development

Edit python files normally in your preferred editor. The server will automatically pick up the changes.

### Before committing

Connect to the web container, make sure to regenerate the migrations if you changed the models, lint and run tests

```
docker exec -it backend-web-1 bash
python manage.py makemigrations
python manage.py migrate
make lint
make test
```

### Stop all containers

```
docker compose down
```

### Flush database

If you want to start from a clean database, you will need to delete you database container and volume, then rebuild the images and restart

```sh
# Close your containers
docker compose down
# Delete database container and its volume
docker rm backend-db-1
docker volume rm backend_data
# Rebuild containers and restart server
docker compose build
docker compose up
# Run the migrations to recreate the db tables
docker exec -it backend-web-1 bash
python manage.py makemigrations
python manage.py migrate
```
