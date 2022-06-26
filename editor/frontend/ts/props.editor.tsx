import { ElementEditor } from "./element.editor.js";
import { Bi } from "./bi.js";

export function PropsEditor() {
    function loadElList() {
        updateEllist(null);
        preload.list.els().then(els => {
            updateEllist(els);
        })
    }
    const [selectedElement, selectElement] = React.useState("");
    const [elList, updateEllist] = React.useState<DBElsFormat[] | null>(null);
    const [addEl, setAddEl] = React.useState<string | -1>(-1);
    const [addElType, setAddElType] = React.useState<string>("");
    React.useEffect(loadElList, [selectedElement]);
    function saveNewEl() {
        if (addEl === -1) return;
        updateEllist(null);
        preload.add.el(addEl, addElType).then(() => {
            selectElement(addEl);
            setAddEl(-1);
        }).catch(err => {
            console.error(err);
            loadElList();
        })
    }
    if (selectedElement) {
        return <ElementEditor id={selectedElement} back={() => selectElement("")}></ElementEditor>
    } else {
        return <>
            <header className="article-heading">Objekte</header>
            <div className="article-toolbar">
                <div className="tool" onClick={() => loadElList()}>
                    <i className="bi-arrow-clockwise"></i>
                </div>
                <div className="tool" onClick={() => setAddEl("")}>
                    <i className="bi-plus-lg"></i>
                </div>
            </div>
            <div className="content">
                {addEl !== -1 ? <>
                    <div className="item-label">Name</div>
                    <input className="item" autoFocus={true} value={addEl} onChange={ev => setAddEl(ev.target.value)}></input>
                    <div className="item-label">Typ</div>
                    <input className="item" value={addElType} onChange={ev => setAddElType(ev.target.value)} onKeyUp={ev => { if (ev.key == "Enter") saveNewEl() }}></input>
                    <div className="buttonArea">
                        <button className="big-button cl-green" onClick={saveNewEl} tabIndex={0}>
                            <span>Speichern</span>
                        </button>
                        <button className="big-button cl-red" onClick={() => {
                            setAddEl(-1);
                            setAddElType("");
                        }} tabIndex={0}>
                            <span>Abbrechen</span>
                        </button>
                    </div>
                </> : null}
                {elList ? (elList.length ? elList.map(_ => <div className="item" key={_.id} onClick={() => selectElement(_.id)}>
                    {_.id}
                </div>) : "no items") : "loading"}
            </div>
        </>
    }
}