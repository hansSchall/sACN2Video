export function AddAsset(props: {
    back: VoidFn,
}) {
    function fileDialog() {
        preload.assets.fileDialog().then(path => {
            if (path) {
                setFilePath(path);
            } else if (!filePath) {
                props.back();
            }
        })
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
    return <>
        <header className="article-heading">Add Asset</header>
        <div className="article-toolbar">
            <div className="tool" onClick={props.back}>
                <i className="bi-chevron-left"></i>
            </div>
            {/* <div className="tool" onClick={() => select(-1)}>
                <i className="bi-plus-lg"></i>
            </div> */}
        </div>
        <div className="content">
            {action ? action : <>
                <div className="item-label">Name</div>
                <input className="item" autoFocus={true} value={id} onChange={ev => setId(ev.target.value)}></input>
                <div className="item-label">Path</div>
                <div className="item" onClick={fileDialog}>{filePath}</div>
                <div className="item-label">Label</div>
                <input className="item" value={label} onChange={ev => setLabel(ev.target.value)}></input>
                <div className="item-label">MIME</div>
                <input className="item" value={mime} onChange={ev => setMime(ev.target.value)} onKeyUp={ev => { if (ev.key == "Enter") null }}></input>
                <div className="buttonArea">
                    <button className="big-button cl-green" onClick={save} tabIndex={0}>
                        <span>Speichern</span>
                    </button>
                    <button className="big-button cl-red" onClick={props.back} tabIndex={0}>
                        <span>Abbrechen</span>
                    </button>
                </div>
            </>}
        </div>
    </>
}