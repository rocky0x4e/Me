
import socket
import netifaces
from flask import Flask, render_template


def create_app():
    app = Flask(__name__)

    @app.route("/")
    def home():

        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        myIp = "localhost"
        gatewayIp = netifaces.gateways()["default"][netifaces.AF_INET][0]
        try:
            # Doesn't have to be reachable — just a valid IP
            s.connect(("8.8.8.8", 80))
            myIp = s.getsockname()[0]
        finally:
            s.close()

        return render_template("home.html", gatewayAdmin=f"http://{gatewayIp}", adguardAdmin=f"http://{myIp}:8080")

    return app
