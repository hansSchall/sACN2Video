import { Assets } from "./assets.js";
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
    const [previewUrl, setPreviewUrl] = React.useState("");
    React.useEffect(() => {
        preload.getPreviewUrl().then(setPreviewUrl);
        preload.isSplitscreenEnabled().then(setSplitscreen);
    }, []);
    function reloadPreview() {
        setPreviewUrl("");
        preload.getPreviewUrl().then(setPreviewUrl);
    }
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
            <div onClick={reloadPreview}>
                <i className="bi-arrow-clockwise"></i>
            </div>
            <div className={splitscreen ? "active" : ""} onClick={() => setSplitscreen(!splitscreen)}>
                <i className="bi-layout-split"></i>
            </div>
        </aside>
        <article>
            {rootView == "props" ? <PropsEditor /> : <Assets />}
        </article>
        {splitscreen ?
            <article id="preview">
                {previewUrl ?
                    <iframe src={previewUrl}></iframe> :
                    <span >loading preview...</span>
                }
            </article> : null
        }
    </>
}