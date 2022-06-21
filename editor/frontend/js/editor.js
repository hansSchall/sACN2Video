import { PropsEditor } from "./props.editor.js";
window.addEventListener("load", () => {
    // @ts-ignore
    const root = ReactDOM.createRoot(document.querySelector("#app"));
    // Initial render
    root.render(React.createElement(App, null));
});
function App() {
    const [rootView, setRootView] = React.useState("props");
    const [splitscreen, setSplitscreen] = React.useState(false);
    return React.createElement(React.Fragment, null,
        React.createElement("aside", null,
            React.createElement("div", null,
                React.createElement("i", { className: "bi-list" })),
            React.createElement("div", { className: rootView == "assets" ? "active" : "", onClick: () => setRootView("assets") },
                React.createElement("i", { className: "bi-image" })),
            React.createElement("div", { className: rootView == "props" ? "active" : "", onClick: () => setRootView("props") },
                React.createElement("i", { className: "bi-clipboard" })),
            React.createElement("div", null,
                React.createElement("i", { className: "bi-arrow-clockwise" })),
            React.createElement("div", { className: splitscreen ? "active" : "", onClick: () => setSplitscreen(!splitscreen) },
                React.createElement("i", { className: "bi-layout-split" }))),
        React.createElement("article", null, rootView == "props" ? React.createElement(PropsEditor, null) : "add assets"),
        splitscreen ?
            React.createElement("article", { id: "preview" }) : null);
}
