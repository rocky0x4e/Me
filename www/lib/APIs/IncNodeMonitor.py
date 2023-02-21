from lib.APIs import BaseAPI


class IncNodeMonitor(BaseAPI):
    def __init__(self, url=None, headers=None, payload=None):
        super().__init__("https://monitor.incognito.org/pubkeystat", headers, payload)

    def getNodeStatDetail(self, keyList):
        self.payload = {"mpk": keyList}
        return self.post(route="/committee", payloadString=False)

    def getNodeStat(self, keyList):
        self.payload = {"mpk": ",".join(keyList)}
        return self.post(route="/stat", payloadString=False)
