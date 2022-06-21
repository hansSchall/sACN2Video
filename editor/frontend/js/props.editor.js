export function PropsEditor() {
    const [selectedElement, selectElement] = React.useState("");
    const [elList, updateellist] = React.useState([]);
    if (selectedElement) {
        return React.createElement(React.Fragment, null,
            React.createElement("header", { className: "article-heading" }, selectedElement),
            React.createElement("div", { className: "article-toolbar" },
                React.createElement("div", { className: "tool", onClick: () => selectElement("") },
                    React.createElement("i", { className: "bi-chevron-left" })),
                React.createElement("div", { className: "tool" },
                    React.createElement("i", { className: "bi-arrow-clockwise" })),
                React.createElement("div", { className: "tool" },
                    React.createElement("i", { className: "bi-plus-lg" })),
                React.createElement("div", { className: "tool" },
                    React.createElement("i", { className: "bi-trash" }))));
    }
    else {
        return React.createElement(React.Fragment, null,
            React.createElement("header", { className: "article-heading" }, "Objekte"),
            React.createElement("div", { className: "article-toolbar" },
                React.createElement("div", { className: "tool" },
                    React.createElement("i", { className: "bi-arrow-clockwise" })),
                React.createElement("div", { className: "tool" },
                    React.createElement("i", { className: "bi-plus-lg" }))),
            React.createElement("div", { className: "content" }, elList.length ? elList.map(_ => React.createElement("div", { className: "item", onClick: () => selectElement(_) }, _)) : ("loading or nothing to show")));
    }
}
