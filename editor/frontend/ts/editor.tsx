import { PropsEditor } from "./props.editor.js";

window.addEventListener("load", () => {
    // @ts-ignore
    const root = ReactDOM.createRoot(document.querySelector("#app"));
    // Initial render
    root.render(<App />);
})

function App() {
    const [rootView, setRootView] = React.useState("props")
    const [splitscreen, setSplitscreen] = React.useState(false)
    return <>
        <aside>
            <div>
                <i className="bi-list"></i>
            </div>
            <div className={rootView == "assets" ? "active" : ""} onClick={() => setRootView("assets")}>
                <i className="bi-image"></i>
            </div>
            <div className={rootView == "props" ? "active" : ""} onClick={() => setRootView("props")}>
                <i className="bi-clipboard"></i>
            </div>
            <div>
                <i className="bi-arrow-clockwise"></i>
            </div>
            <div className={splitscreen ? "active" : ""} onClick={() => setSplitscreen(!splitscreen)}>
                <i className="bi-layout-split"></i>
            </div>
        </aside>
        <article>
            {rootView == "props" ? <PropsEditor /> : "add assets"}

        </article>
        {splitscreen ?
            <article id="preview">

            </article> : null
        }
    </>
}