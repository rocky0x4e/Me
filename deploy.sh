#!/bin/bash

SYSD_SERVICE=RockyWWW
WORKING_DIR=$(pwd)

python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt

systemctl --user stop $SYSD_SERVICE

cat << "EOF" > /home/rocky/.config/systemd/user/$SYSD_SERVICE
[Unit]
Description = My python web server
After = network.target

[Service]
Type=notify
WorkingDirectory = ${WORKING_DIR}/www
ExecStart = ${WORKING_DIR}/www/venv/bin/gunicorn --pid ./pid --workers 4 --bind unix:${WORKING_DIR}/Me/www/app.sock wsgi:app
ExecReload = /bin/kill -s HUP $MAINPID
ExecStop = /bin/kill -s TERM $MAINPID
StandardOutput = journal
StandardError = journal
SyslogIdentifier = ${SYSD_SERVICE}

[Install]
WantedBy = default.target
EOF

systemctl --user daemon-reload
systemctl --user enable $SYSD_SERVICE
systemctl --user start $SYSD_SERVICE