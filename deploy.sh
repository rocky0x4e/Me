#!/bin/bash
pkill gunicorn -9

python3 -m venv venv
source ./venv/bin/activate

pip install -r requirements.txt

cd www
gunicorn -D --log-file runtime.log \
    --pid ./pid --workers 4 --bind unix:app.sock wsgi:app
