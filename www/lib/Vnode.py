from lib.APIs.IncNodeRpc import IncNodeRpc
from lib.APIs.IncNodeMonitor import IncNodeMonitor


class Vnode:
    def __init__(self, **kwarg):
        self.url = kwarg.get("url", "")
        self.name = kwarg.get("name", "")
        self.rpc = IncNodeRpc(self.url).makeRpc()
        self.monitor = IncNodeMonitor()
        self.keys = {}

    @property
    def keyMiningPublic(self):
        return self.keys["bls"]

    @keyMiningPublic.setter
    def keyMiningPublic(self, value):
        self.keys["bls"] = value

    @property
    def keyPublic(self):
        return self.keys["dsa"]

    @keyPublic.setter
    def keyPublic(self, value):
        self.keys["dsa"] = value

    def getPublicMiningKey(self):
        response = self.rpc.setMethod("getpublickeymining").post()
        rList = response.json()["Result"]
        for item in rList:
            key, value = item.split(":")
            self.keys[key] = value

        return self.keyMiningPublic

    def getNodeStatDetail(self):
        return self.monitor.getNodeStatDetail(self.keyMiningPublic)

    def getCurrentEpoch(self):
        info = self.rpc.getBlockchainInfo()
        try:
            return info.json()["Result"]["BestBlocks"]["-1"]["Epoch"]
        except:
            return 0

    def getAvailableReward(self, paymentK):
        rewardInf = self.rpc.getMiningReward(paymentK)
        try:
            return int(rewardInf.json()["Result"]["PRV"])
        except:
            return 0
