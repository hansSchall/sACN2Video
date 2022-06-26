import { PropEditor } from "./prop.editor.js";
export function ElementEditor(props) {
    function loadPropList() {
        updateProplist(null);
        preload.list.props(props.id).then(props => {
            updateProplist(props);
        });
    }
    const [selectedProp, selectProp] = React.useState("");
    const [propList, updateProplist] = React.useState(null);
    const [addProp, setAddProp] = React.useState(-1);
    React.useEffect(loadPropList, [props.id, selectedProp]);
    function saveNewProp() {
        if (addProp === -1)
            return;
        updateProplist(null);
        preload.add.prop(props.id, addProp).then(() => {
            selectProp(addProp);
            setAddProp(-1);
        }).catch(err => {
            console.error(err);
            loadPropList();
        });
    }
    if (selectedProp) {
        return React.createElement(PropEditor, { el: props.id, prop: selectedProp, back: () => selectProp("") });
    }
    else {
        return React.createElement(React.Fragment, null,
            React.createElement("header", { className: "article-heading" }, props.id),
            React.createElement("div", { className: "article-toolbar" },
                React.createElement("div", { className: "tool", onClick: props.back },
                    React.createElement("i", { className: "bi-chevron-left" })),
                React.createElement("div", { className: "tool", onClick: loadPropList },
                    React.createElement("i", { className: "bi-arrow-clockwise" })),
                React.createElement("div", { className: "tool", onClick: () => setAddProp("") },
                    React.createElement("i", { className: "bi-plus-lg" })),
                React.createElement("div", { className: "tool", onClick: () => {
                        preload.delete.el(props.id).then(_ => _ ? props.back() : null);
                    } },
                    React.createElement("i", { className: "bi-trash" }))),
            React.createElement("div", { className: "content" },
                addProp !== -1 ? React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "item-label" }, "Name"),
                    React.createElement("input", { className: "item", autoFocus: true, value: addProp, onChange: ev => setAddProp(ev.target.value), onKeyUp: ev => { if (ev.key == "Enter")
                            saveNewProp(); } }),
                    React.createElement("div", { className: "buttonArea" },
                        React.createElement("button", { className: "big-button cl-green", onClick: saveNewProp, tabIndex: 0 },
                            React.createElement("span", null, "Speichern")),
                        React.createElement("button", { className: "big-button cl-red", onClick: () => {
                                setAddProp(-1);
                            }, tabIndex: 0 },
                            React.createElement("span", null, "Abbrechen")))) : null,
                propList ? (propList.length ? propList.map(_ => React.createElement("div", { className: "item", key: _.prop, onClick: () => selectProp(_.prop) },
                    _.prop,
                    " (",
                    _.valueType,
                    ":",
                    _.value,
                    ")")) : "no items") : "loading"));
    }
}
