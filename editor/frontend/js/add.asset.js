export function AddAsset(props) {
    function fileDialog() {
        preload.assets.fileDialog().then(path => {
            if (path) {
                setFilePath(path);
            }
            else if (!filePath) {
                props.back();
            }
        });
    }
    function save() {
        setAction("saving");
        preload.assets.add(id, filePath, label, mime).then(props.back);
    }
    const [filePath, setFilePath] = React.useState("");
    const [id, setId] = React.useState("");
    const [label, setLabel] = React.useState("");
    const [mime, setMime] = React.useState("");
    const [action, setAction] = React.useState("");
    React.useEffect(fileDialog, []);
    // const [id, setId] = React.useState("");
    return React.createElement(React.Fragment, null,
        React.createElement("header", { className: "article-heading" }, "Add Asset"),
        React.createElement("div", { className: "article-toolbar" },
            React.createElement("div", { className: "tool", onClick: props.back },
                React.createElement("i", { className: "bi-chevron-left" }))),
        React.createElement("div", { className: "content" }, action ? action : React.createElement(React.Fragment, null,
            React.createElement("div", { className: "item-label" }, "Name"),
            React.createElement("input", { className: "item", autoFocus: true, value: id, onChange: ev => setId(ev.target.value) }),
            React.createElement("div", { className: "item-label" }, "Path"),
            React.createElement("div", { className: "item", onClick: fileDialog }, filePath),
            React.createElement("div", { className: "item-label" }, "Label"),
            React.createElement("input", { className: "item", value: label, onChange: ev => setLabel(ev.target.value) }),
            React.createElement("div", { className: "item-label" }, "MIME"),
            React.createElement("input", { className: "item", value: mime, onChange: ev => setMime(ev.target.value), onKeyUp: ev => { if (ev.key == "Enter")
                    null; } }),
            React.createElement("div", { className: "buttonArea" },
                React.createElement("button", { className: "big-button cl-green", onClick: save, tabIndex: 0 },
                    React.createElement("span", null, "Speichern")),
                React.createElement("button", { className: "big-button cl-red", onClick: props.back, tabIndex: 0 },
                    React.createElement("span", null, "Abbrechen"))))));
}
