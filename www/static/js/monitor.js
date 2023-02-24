function getAvailableReward() {
    showLoading()
    let fullnode = document.getElementById("fullnode").textContent;
    let paymentK = document.getElementById("payment-k").textContent;
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
        response.json().then(r => {
            let ele = document.getElementById("reward-inf"); ele.style.height = "100%";
            ele.textContent = `* Available reward: ${r.Result.PRV / 1e9}`;
        })
    }).finally(() => {
        hideLoading()
    })
}

async function getDetailStat(ele) {
    let newEleID = "subViewContainer"
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
        let subTableHeaders = ["#", "Epoch", "ChainID", "voteStat", "IsSlashed", "Reward"]
        let thead = document.getElementById("subTableHeader")
        for (key of subTableHeaders) {
            let th = document.createElement("th")
            th.textContent = key
            thead.appendChild(th)
        }
        let tbody = document.getElementById("subTableBody")

        response.json().then(result => {
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
    })
}
