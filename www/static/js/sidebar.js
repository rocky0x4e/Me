var sidebarWidth = "250px";
function closeBar() {
    document.getElementById("sidebarBackground").hidden = true
    document.getElementById("mySidebar").style.width = "0px";
}

function toggleBar() {
    let bar = document.getElementById("mySidebar")
    let width = bar.style.width;
    width = width == null || width == "0px" ? 0 : width;
    bar.style.width = width ? "0px" : sidebarWidth;

    let bgVisible = document.getElementById("sidebarBackground")
    bgVisible.hidden = !bgVisible.hidden
}