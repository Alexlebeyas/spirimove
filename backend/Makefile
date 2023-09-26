lint:
	pylint --load-plugins pylint_django **/*.py
	flake8

test:
	python manage.py makemigrations --check --dry-run
	python manage.py test
