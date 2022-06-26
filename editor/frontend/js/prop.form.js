export function PropForm(props) {
    const [valueType, setValueType] = React.useState(props.valueType);
    const [value, setValue] = React.useState(props.value);
    function save() {
        props.save(valueType, value);
    }
    return React.createElement(React.Fragment, null,
        React.createElement("header", { className: "article-heading" }, props.title),
        React.createElement("div", { className: "article-toolbar" },
            React.createElement("div", { className: "tool", onClick: props.back },
                React.createElement("i", { className: "bi-chevron-left" })),
            React.createElement("div", { className: "tool", onClick: props.deleteProp },
                React.createElement("i", { className: "bi-trash" }))),
        React.createElement("div", { className: "content" },
            React.createElement("div", { className: "item-label" }, "Element"),
            React.createElement("div", { className: "item" }, props.el),
            React.createElement("div", { className: "item-label" }, "Eigenschaft"),
            React.createElement("div", { className: "item" }, props.prop),
            React.createElement("div", { className: "item-label" }, "valueType"),
            React.createElement("input", { className: "item", autoFocus: true, value: valueType, onChange: ev => setValueType(ev.target.value) }),
            React.createElement("div", { className: "item-label" }, "Value"),
            React.createElement("input", { className: "item", value: value, onChange: ev => setValue(ev.target.value), onKeyUp: ev => { if (ev.key == "Enter")
                    save(); } })),
        React.createElement("div", { className: "buttonArea" },
            React.createElement("button", { className: "big-button cl-orange", onClick: save, tabIndex: 0 },
                React.createElement("span", null, "Speichern"))));
}
