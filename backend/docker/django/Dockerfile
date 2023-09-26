FROM python:3.10.6-slim

COPY . /spiri_move

WORKDIR /spiri_move

RUN apt-get -y update \
	&& apt-get -y install --no-install-recommends \
		libjpeg-dev \
		libproj-dev \
		gettext \
		libgettextpo-dev \
		netcat \
		make \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt \
	&& pip install --no-cache-dir -r requirements-dev.txt
