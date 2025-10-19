import json
import re
import datetime
from flask import Flask, render_template
from lib.APIs.IncNodeMonitor import IncNodeMonitor
from lib.Vnode import Vnode


def create_app():
    app = Flask(__name__)
    nodeMonitor = IncNodeMonitor()

    @app.route("/")
    def home():
        return render_template("home.html")

    return app
