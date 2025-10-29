#!/bin/bash

SERVICE_NAME=MyWWW
SYSD_SERVICE_PATH=$HOME/.config/systemd/user
SYSD_SERVICE_FILE=$SYSD_SERVICE_PATH/${SERVICE_NAME}.service
WORKING_DIR=$(pwd -P)


python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt

mkdir -p  $SYSD_SERVICE_PATH
systemctl --user stop $SERVICE_NAME 2> /dev/null

cat << EOF > $SYSD_SERVICE_FILE
[Unit]
Description = My python web server
After = network.target

[Service]
Type=notify
WorkingDirectory = ${WORKING_DIR}/www
ExecStart = ${WORKING_DIR}/venv/bin/gunicorn --pid ./pid --workers 4 --bind unix:${WORKING_DIR}/www/app.sock wsgi:app
EOF
cat << "EOF" >> $SYSD_SERVICE_FILE
ExecReload = /bin/kill -s HUP $MAINPID
ExecStop = /bin/kill -s TERM $MAINPID
EOF
cat << EOF >> $SYSD_SERVICE_FILE
StandardOutput = journal
StandardError = journal
SyslogIdentifier = $SERVICE_NAME

[Install]
WantedBy = default.target
EOF

systemctl --user daemon-reload
systemctl --user enable $SERVICE_NAME
systemctl --user start $SERVICE_NAME