function initEditor() {
    // goToView("edit-props-ellist");
    $("#edit-props-button").addEventListener("click", () => {
        goToView("edit-props-ellist");
    })
    $("#add-el-button").addEventListener("click", () => {

    })
    updateElList();
}
async function updateElList() {
    const el = $("#ep-ellist");
    el.innerText = "loading...";
    const els = await preload.ellist();
    el.innerHTML = "";
    els.forEach(item => {
        el.appendChild($el("list-item", "button", "", el => {
            el.innerText = `${item?.id ?? ""} (${item?.type ?? ""})`;
            el.addEventListener("click", () => {
                // $("")
            })
        }))
    })
}