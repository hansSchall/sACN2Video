export function AssetDetails(props) {
    return React.createElement(React.Fragment, null,
        React.createElement("header", { className: "article-heading" },
            "Details for ",
            props.id),
        React.createElement("div", { className: "article-toolbar" },
            React.createElement("div", { className: "tool", onClick: props.back },
                React.createElement("i", { className: "bi-chevron-left" })),
            React.createElement("div", { className: "tool", onClick: () => {
                    preload.assets.delete(props.id).then(_ => _ ? props.back() : null);
                } },
                React.createElement("i", { className: "bi-trash" }))),
        React.createElement("div", { className: "content" },
            React.createElement("div", { className: "item-label" }, "Name"),
            React.createElement("div", { className: "item" }, props.id)));
}
