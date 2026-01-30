let LOADING = 0;
function showLoading() {
    LOADING++
    if (LOADING == 1) {
        document.getElementById("loading").style.width = "100%"
    }
}

function hideLoading() {
    LOADING--;
    if (LOADING <= 0) {
        document.getElementById("loading").style.width = "0%"
    }
}

async function loading3s() {
    document.getElementById("loading").style.width = "100%"
    await new Promise(resolve => setTimeout(resolve, 3000))
    document.getElementById("loading").style.width = "0%"

}