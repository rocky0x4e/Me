import json


class AppContext:
    def __init__(self):
        with open("config/env.json") as fconfig:
            self.context = json.load(fconfig)

    @property
    def BLK_TIME(self):
        return self.context.get("blocktime", 40)

    @BLK_TIME.setter
    def BLK_TIME(self, value):
        self.context['blocktime'] = value

    @property
    def KEY_MINING_PUB(self):
        return self.context["keyMiningPub"]

    @property
    def KEY_PAYMENT(self):
        return self.context["keyPayment"]
