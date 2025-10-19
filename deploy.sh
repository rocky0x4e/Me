#!/bin/bash

python3 -m venv venv
source ./venv/bin/activate

pip install -r requirements.txt

gunicorn --pid ./pid --workers 4 --bind unix:app.sock wsgi:app
