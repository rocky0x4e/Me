#!/bin/bash

SYSD_SERVICE=RockyWWW.service
WORKING_DIR=$(pwd)

python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt

systemctl --user stop $SYSD_SERVICE

cat << EOF > /home/rocky/.config/systemd/user/$SYSD_SERVICE
[Unit]
Description = My python web server
After = network.target

[Service]
Type=notify
WorkingDirectory = ${WORKING_DIR}/www
ExecStart = ${WORKING_DIR}/venv/bin/gunicorn --pid ./pid --workers 4 --bind unix:${WORKING_DIR}/www/app.sock wsgi:app
EOF
cat << "EOF" > /home/rocky/.config/systemd/user/$SYSD_SERVICE
ExecReload = /bin/kill -s HUP $MAINPID
ExecStop = /bin/kill -s TERM $MAINPID
EOF
cat << EOF > /home/rocky/.config/systemd/user/$SYSD_SERVICE
StandardOutput = journal
StandardError = journal
SyslogIdentifier = ${SYSD_SERVICE//.service/}

[Install]
WantedBy = default.target
EOF

systemctl --user daemon-reload
systemctl --user enable $SYSD_SERVICE
systemctl --user start $SYSD_SERVICE