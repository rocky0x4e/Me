import json
import re
import datetime
from flask import Flask, render_template
from lib.APIs.IncNodeMonitor import IncNodeMonitor
from lib.Vnode import Vnode
from lib.AppContext import AppContext


def create_app():
    CONTEXT = AppContext()
    app = Flask(__name__)
    nodeMonitor = IncNodeMonitor()
    with open("config/vnode.json") as fVnode:
        vnode = Vnode(**json.load(fVnode)[0])

    @app.route("/")
    def home():
        return render_template("home.html")

    @app.route("/monitor")
    def monitor():
        blkcInfo = vnode.rpc.getBlockchainInfo()
        try:
            CURRENT_E = blkcInfo.json()["Result"]["BestBlocks"]["-1"]["Epoch"]
        except:
            CURRENT_E = 0

        try:
            CURRENT_H = blkcInfo.json()["Result"]["BestBlocks"]["-1"]["Height"]
        except:
            CURRENT_H = 0

        try:
            REMAIN_BLOCK = blkcInfo.json(
            )["Result"]["BestBlocks"]["-1"]["RemainingBlockEpoch"]
        except:
            REMAIN_BLOCK = 0

        stats = nodeMonitor.getNodeStat(CONTEXT.KEY_MINING_PUB).json()
        for item in stats:
            next_event = item["NextEventMsg"]
            reg = re.compile(r'(wait )?(\d+) epoch( to be (\w+))?')
            match = re.match(reg, next_event)
            if match is not None:
                nextECount = int(match.group(2))
                nextRole = match.group(4)
                nextTimeCount = datetime.timedelta(
                    seconds=((nextECount) * 350 + REMAIN_BLOCK) * CONTEXT.BLK_TIME)
                if nextRole is None:
                    msg = "Wait %de (%s)" % (nextECount, nextTimeCount)
                else:
                    msg = "%de (%s) -> %s" % (nextECount,
                                              nextTimeCount, nextRole.capitalize())
                nextEMsg = msg.replace(" days", "d").replace(" day", "d")
            else:
                nextECount = 0
                nextRole = ""
                nextEMsg = next_event
                nextTimeCount = datetime.timedelta(seconds=0)

            regex = re.compile(r'.*\(epoch:(\d+)\)')
            matchLastEarn = re.match(regex, item["VoteStat"][0])
            lastEarnE = 0
            if matchLastEarn is not None:
                lastEarnE = int(matchLastEarn.group(1))

            item["Status"] = item["Status"][:3]
            item["Role"] = item["Role"].capitalize()
            item["nextEMsg"] = nextEMsg
            item["nextECount"] = nextECount
            item["nextRole"] = nextRole
            item["nextTCount"] = nextTimeCount
            item["SyncState"] = item["SyncState"].capitalize()
            item["VoteStat"] = item["VoteStat"][0].split(" ")[0]
            item["IsOldVersion"] = "latest" if item["IsOldVersion"] else "Old"
            item["lastEarn"] = CURRENT_E - lastEarnE

        stats = sorted(stats, key=lambda item: [
                       item["Role"],
                       #    item["CommitteeChain"],
                       item["nextECount"]])

        blkInfo = {"epoch": CURRENT_E,
                   "height": CURRENT_H,
                   "remainB": REMAIN_BLOCK,
                   "remainT": datetime.timedelta(seconds=REMAIN_BLOCK*CONTEXT.BLK_TIME),
                   "blkTime": CONTEXT.BLK_TIME}
        return render_template("monitor.html", blkInfo=blkInfo, nodestat=stats, paymentK=CONTEXT.KEY_PAYMENT, fullnode=vnode.url)

    return app
