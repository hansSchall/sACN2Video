import { ElementEditor } from "./element.editor.js";
export function PropsEditor() {
    function loadElList() {
        updateEllist(null);
        preload.list.els().then(els => {
            updateEllist(els);
        });
    }
    const [selectedElement, selectElement] = React.useState("");
    const [elList, updateEllist] = React.useState(null);
    const [addEl, setAddEl] = React.useState(-1);
    const [addElType, setAddElType] = React.useState("");
    React.useEffect(loadElList, [selectedElement]);
    function saveNewEl() {
        if (addEl === -1)
            return;
        updateEllist(null);
        preload.add.el(addEl, addElType).then(() => {
            selectElement(addEl);
            setAddEl(-1);
        }).catch(err => {
            console.error(err);
            loadElList();
        });
    }
    if (selectedElement) {
        return React.createElement(ElementEditor, { id: selectedElement, back: () => selectElement("") });
    }
    else {
        return React.createElement(React.Fragment, null,
            React.createElement("header", { className: "article-heading" }, "Objekte"),
            React.createElement("div", { className: "article-toolbar" },
                React.createElement("div", { className: "tool", onClick: () => loadElList() },
                    React.createElement("i", { className: "bi-arrow-clockwise" })),
                React.createElement("div", { className: "tool", onClick: () => setAddEl("") },
                    React.createElement("i", { className: "bi-plus-lg" }))),
            React.createElement("div", { className: "content" },
                addEl !== -1 ? React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "item-label" }, "Name"),
                    React.createElement("input", { className: "item", autoFocus: true, value: addEl, onChange: ev => setAddEl(ev.target.value) }),
                    React.createElement("div", { className: "item-label" }, "Typ"),
                    React.createElement("input", { className: "item", value: addElType, onChange: ev => setAddElType(ev.target.value), onKeyUp: ev => { if (ev.key == "Enter")
                            saveNewEl(); } }),
                    React.createElement("div", { className: "buttonArea" },
                        React.createElement("button", { className: "big-button cl-green", onClick: saveNewEl, tabIndex: 0 },
                            React.createElement("span", null, "Speichern")),
                        React.createElement("button", { className: "big-button cl-red", onClick: () => {
                                setAddEl(-1);
                                setAddElType("");
                            }, tabIndex: 0 },
                            React.createElement("span", null, "Abbrechen")))) : null,
                elList ? (elList.length ? elList.map(_ => React.createElement("div", { className: "item", key: _.id, onClick: () => selectElement(_.id) }, _.id)) : "no items") : "loading"));
    }
}
