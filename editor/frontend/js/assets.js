import { AddAsset } from "./add.asset.js";
export function Assets() {
    function loadList() {
        updateList(null);
        preload.assets.list().then(updateList);
    }
    const [assets, updateList] = React.useState(null);
    const [selected, select] = React.useState(-1);
    React.useEffect(loadList, [selected]);
    if (selected) {
        if (selected === -1) {
            return React.createElement(React.Fragment, null,
                React.createElement("header", { className: "article-heading" }, "Assets"),
                React.createElement("div", { className: "article-toolbar" },
                    React.createElement("div", { className: "tool", onClick: loadList },
                        React.createElement("i", { className: "bi-arrow-clockwise" })),
                    React.createElement("div", { className: "tool", onClick: () => select("") },
                        React.createElement("i", { className: "bi-plus-lg" }))),
                React.createElement("div", { className: "content" }, assets ? (assets.length ? assets.map(asset => React.createElement("div", { key: asset, className: "item", onClick: () => select(asset) }, asset)) : "no items") : "loading ..."));
        }
        else {
            return React.createElement(React.Fragment, null, "loading ...");
        }
    }
    else {
        return React.createElement(AddAsset, { back: () => {
                select(-1);
            } });
    }
}
