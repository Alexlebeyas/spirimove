
# To run the project at the first time

You will need to install docker first

## 1. Clone Project:
~~~~
git clone git@ssh.dev.azure.com:v3/SpiriaDigital-Canada/Spiri-Move_ZoneProject/Spiri-Move_ZoneProject
~~~~

## 2. Build docker containers:
First, check requirement.txt and then
~~~~
cd backend
docker-compose build
~~~~

## 3. Start containers:
~~~~
docker-compose up
~~~~

## 4. Run migrations:
First, open a new terminal while the project is running in the main terminal
~~~~
docker exec -it backend-web-1 bash
python manage.py makemigrations
python manage.py migrate
~~~~

## 4. Create superuser:
It could help to access the administration interface or to connect for the tests\
When asked for an email address, enter any valid value, but remember it as it will be useful later.
~~~~
docker exec -it backend-web-1 bash
python manage.py createsuperuser
~~~~
You can complete its information from the Django admin.

## 5. Access to Admin Django:
After creating your first superuser, you must connect to the admin with him and :\
    1 - Assign him the "Admin" Role\
    2 - create a contest.\
You must follow the main link by "/admin"
~~~~
Ex: http://127.0.0.1:8000/admin  (For local)
~~~~


## 6. Api Documentation:
You can access the API documentation by accessing the main link
~~~~
Ex: http://127.0.0.1:8000/ (For local)
~~~~

## 7. Stop all containers:
It could help to access the administration interface or to connect for the tests
~~~~
docker stop $(docker ps -aq)
~~~~



