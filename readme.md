
# To run the project at the first time

You will need to install docker first

## 1. Clone Project:
~~~~
git clone git@ssh.dev.azure.com:v3/SpiriaDigital-Canada/Spiri-Move_ZoneProject/Spiri-Move_ZoneProject
~~~~

## 2. Build docker containers:
Frist, check requirement.txt and then
~~~~
docker-compose build
~~~~

## 3. Start containers:
~~~~
docker-compose up
~~~~

## 4. Run migrations:
Frist, open a new terminal while the project is running in the main terminal
~~~~
docker exec -it spiri_move_web_1 bash
python manage.py makemigrations
python manage.py migrate
~~~~

## 4. Create superuser:
It could help to access the administration interface or to connect for the tests
~~~~
docker exec -it spiri_move_web_1 bash
python manage.py createsuperuser
~~~~

## 5. Stop all containers:
It could help to access the administration interface or to connect for the tests
~~~~
docker stop $(docker ps -aq)
~~~~



