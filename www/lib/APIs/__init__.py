import requests
import json


class BaseAPI:
    DEFAULT_PAYLOAD = {"jsonrpc": "1.0", "id": 1, "params": [], "method": ""}

    def __init__(self, url, headers=None, payload=None):
        self.url = url
        self.headers = {} if headers is None else headers
        self.payload = {} if payload is None else payload

    def post(self, route="", payloadString=True) -> requests.models.Response:
        payload = json.dumps(self.payload) if payloadString else self.payload
        self.payload = BaseAPI.DEFAULT_PAYLOAD
        return requests.post(
            f"{self.url}{route}", headers=self.headers, data=payload, stream=True)

    def get(self, route="") -> requests.models.Response:
        return requests.get(f"{self.url}{route}", headers=self.headers)

    def setMethod(self, method):
        self.payload["method"] = method
        return self

    def setParam(self, param):
        self.payload["params"] = [] if param is None else param
        return self

    def setPayload(self, payload):
        self.payload = {} if payload is None else payload
        return self

    def setPayloads(self, payload):
        self.payload = {} if payload is None else payload
        return self

    def makeRpc(self, method="", params=None):
        self.headers = {
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
        self.payload = BaseAPI.DEFAULT_PAYLOAD
        self.setMethod(method)
        self.setParam(params)
        return self
