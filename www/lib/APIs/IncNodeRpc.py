from lib.APIs import BaseAPI


class IncNodeRpc(BaseAPI):
    def getBlockchainInfo(self):
        return self.setMethod("getblockchaininfo").post()

    def getMiningReward(self, paymentK):
        return self.setMethod("getrewardamount").setParam([paymentK]).post()
