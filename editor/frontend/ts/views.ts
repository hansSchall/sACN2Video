function goToView(id: string) {
    $(`.view[data-id="${id}"]`).classList.add("active");
    $$(`.view.active:not([data-id="${id}"])`).forEach(_ => _.classList.remove("active"));
}
window.addEventListener("load", () => {
    let aasFile: string;
    $("#add-asset-button").addEventListener("click", () => {
        goToView("add-asset--file");
        preload.dialogAssetFile().then((file) => {
            if (!file) return void goToView("home");
            goToView("add-asset");
            $<HTMLInputElement>("#aas-id").focus();
            console.log(file);
            aasFile = file;
        })
        $<HTMLInputElement>("#aas-id").value = "";
        $<HTMLInputElement>("#aas-mime").value = "";
        $<HTMLInputElement>("#aas-label").value = "";
    })
    $("#aas-cancel").addEventListener("click", () => {
        goToView("home");
    })
    $("#aas-ok").addEventListener("click", () => {
        goToView("add-asset--log");
        $(".aas-log").innerText = "";
        preload.aasLog(data => {
            if (data == "@@@finish") {
                setTimeout(() => {
                    goToView("home");
                }, 1000);
            } else {
                $(".aas-log").innerText += data;
            }
        })
        preload.aas(aasFile, $<HTMLInputElement>("#aas-id").value, $<HTMLInputElement>("#aas-mime").value, $<HTMLInputElement>("#aas-label").value);
    })
    $("#aas-log-ok").addEventListener("click", () => {
        goToView("home");
    })
    goToView("home");
    initEditor();
})