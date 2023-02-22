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
        document.getElementById("k-val-pub").textContent = ele.children[1].firstElementChild.textContent
        let view = document.getElementById("node-detail-bg")
        view.style.width = "100%"
        let table = document.getElementById("node-detail-table")
        table.style.height = "90%"
        let viewBody = document.getElementById("node-detail-body")
        let count = viewBody.childElementCount
        for (let i = 0; i < count; i++) {
            viewBody.removeChild(viewBody.lastChild)
        }
        response.json().then(result => {
            for (let index in result) {
                item = result[index]
                //data processing
                item.voteStat = (item.totalVoteConfirm / item.totalEpochCountBlock * 100).toFixed(0) + "%"
                item.IsSlashed = item.IsSlashed ?? false
                item.Reward = (item.Reward / 1e9).toFixed(2)
                item.i = index

                //show
                let row = document.createElement("tr")
                viewBody.appendChild(row)
                for (let info of ["i", "Epoch", "ChainID", "voteStat", "IsSlashed", "Reward"]) {
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

function hideDetailView() {
    document.getElementById("node-detail-table").style.height = 0
    document.getElementById("node-detail-bg").style.width = 0

}