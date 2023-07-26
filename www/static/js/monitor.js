function showMore(ele) {
    let fullnode = document.getElementById("fullnode").textContent;
    let paymentK = document.getElementById("payment-k").textContent;
    let pool_id = '0000000000000000000000000000000000000000000000000000000000000004-076a4423fa20922526bd50b0d7b0dc1c593ce16e15ba141ede5fb5a28aa3f229-33a8ceae6db677d9860a6731de1a01de7e1ca7930404d7ec9ef5028f226f1633'
    let beaconH = parseInt(ele.id)
    showLoading()
    let mores = document.getElementsByClassName("more")
    while (mores.length > 0) {
        mores[0].remove()
    }
    fetch(fullnode, {
        method: "POST",
        body: JSON.stringify({
            "id": 1,
            "jsonrpc": "1.0",
            "method": "getrewardamount",
            "params": [paymentK]
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(r => {
        let e = document.createElement("div")
        e.setAttribute("class", "more")
        e.textContent = `* Available reward: ${r.Result.PRV / 1e9}`;
        ele.appendChild(e)
    }).finally(() => {
        hideLoading()
    })

    showLoading()
    fetch(fullnode, {
        method: "POST",
        body: JSON.stringify({
            "id": 1, "jsonrpc": "1.0", "method": "pdexv3_getState", "params": [
                {
                    "BeaconHeight": beaconH,
                    "Filter": {
                        "Key": "PoolPair",
                        "Verbosity": 1,
                        "ID": pool_id
                    }
                }]
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(r => {
        let pool_info = r["Result"]["PoolPairs"][pool_id]
        let v_pool_usdt = pool_info["State"]["Token1VirtualAmount"]
        let v_pool_prv = pool_info["State"]["Token0VirtualAmount"]
        let r_pool_usdt = pool_info["State"]["Token1RealAmount"]
        let r_pool_prv = pool_info["State"]["Token0RealAmount"]
        let amp = pool_info["State"]["Amplifier"]
        let price = v_pool_usdt / v_pool_prv
        let e = document.createElement("div")
        e.setAttribute("class", "more")
        e.style.height = "100%";
        e.textContent = `* PRV price ${price.toFixed(4)},
             RPool PRV-USDT: ${(r_pool_prv / 1e9).toFixed(2)} - ${(r_pool_usdt / 1e9).toFixed(2)},
             VPool: ${(v_pool_prv / 1e9).toFixed(2)} - ${(v_pool_usdt / 1e9).toFixed(2)}, AMP: ${(amp / 10000).toFixed(1)}`;
        ele.appendChild(e)
    }).finally(() => {
        hideLoading()
    })
}

async function getDetailStat(ele) {
    let newEleID = "subViewContainer"
    let subTableHeaders = ["#", "Epoch", "ChainID", "voteStat", "IsSlashed", "Reward"]
    if (e = document.getElementById(newEleID)) {
        e.remove()
        return
    }

    showLoading()
    fetch("https://monitor.incognito.org/pubkeystat/committee", {
        method: "POST",
        body: JSON.stringify({
            "mpk": ele.children[1].firstElementChild.textContent
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        let newEleHtml = `
            <tr id="${newEleID}">
                <td colspan="100%" class="m-table-cell">
                    <div id="subView">
                        <div class="group-mpk">
                            <div>Validator public key:</div>
                            <div id="mpk"></div>
                        </div>
                        <table>
                            <thead id="subTableHeader"></thead>
                            <tbody id="subTableBody"></tbody>
                        </table>
                    </div>
                </td>
            </tr>
        `
        ele.insertAdjacentHTML("afterEnd", newEleHtml)
        document.getElementById("mpk").textContent = ele.children[1].textContent
        let thead = document.getElementById("subTableHeader")
        for (key of subTableHeaders) {
            let th = document.createElement("th")
            th.textContent = key
            thead.appendChild(th)
        }

        return response.json()
    }).then(result => {
        let tbody = document.getElementById("subTableBody")
        for (let index in result) {
            item = result[index]
            //data processing
            item.voteStat = (item.totalVoteConfirm / item.totalEpochCountBlock * 100).toFixed(0) + "%"
            item.IsSlashed = item.IsSlashed ?? false
            item.Reward = (item.Reward / 1e9).toFixed(2)
            item["#"] = index

            //show
            let row = document.createElement("tr")
            tbody.appendChild(row)
            for (let info of subTableHeaders) {
                let cell = document.createElement("td")
                let div = document.createElement("div")
                cell.appendChild(div)
                div.setAttribute("class", "m-table-cell")
                div.textContent = item[info]
                row.appendChild(cell)
            }
        }
    }).finally(() => {
        hideLoading()
    })
}
