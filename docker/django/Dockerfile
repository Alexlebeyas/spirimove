FROM python:3.10.6-slim
COPY . /spiri_move
WORKDIR /spiri_move
RUN apt-get update -y && apt-get install libjpeg-dev libproj-dev gettext libgettextpo-dev netcat -y
RUN pip install pip
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
