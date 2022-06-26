import { PropEditor } from "./prop.editor.js";

export function ElementEditor(props: {
    id: string,
    back: () => void
}) {
    function loadPropList() {
        updateProplist(null);
        preload.list.props(props.id).then(props => {
            updateProplist(props);
        })
    }
    const [selectedProp, selectProp] = React.useState("");
    const [propList, updateProplist] = React.useState<DBPropsFormat[] | null>(null);
    const [addProp, setAddProp] = React.useState<string | -1>(-1);
    React.useEffect(loadPropList, [props.id, selectedProp]);
    function saveNewProp() {
        if (addProp === -1) return;
        updateProplist(null);
        preload.add.prop(props.id, addProp).then(() => {
            selectProp(addProp);
            setAddProp(-1);
        }).catch(err => {
            console.error(err);
            loadPropList();
        })
    }
    if (selectedProp) {
        return <PropEditor el={props.id} prop={selectedProp} back={() => selectProp("")}></PropEditor>
    } else {
        return <>
            <header className="article-heading">{props.id}</header>
            <div className="article-toolbar">
                <div className="tool" onClick={props.back}>
                    <i className="bi-chevron-left"></i>
                </div>
                <div className="tool" onClick={loadPropList}>
                    <i className="bi-arrow-clockwise"></i>
                </div>
                <div className="tool" onClick={() => setAddProp("")}>
                    <i className="bi-plus-lg"></i>
                </div>
                <div className="tool" onClick={() => {
                    preload.delete.el(props.id).then(_ => _ ? props.back() : null);
                }}>
                    <i className="bi-trash"></i>
                </div>
            </div>
            <div className="content">
                {addProp !== -1 ? <>
                    <div className="item-label">Name</div>
                    <input className="item" autoFocus={true} value={addProp} onChange={ev => setAddProp(ev.target.value)} onKeyUp={ev => { if (ev.key == "Enter") saveNewProp() }}></input>
                    <div className="buttonArea">
                        <button className="big-button cl-green" onClick={saveNewProp} tabIndex={0}>
                            <span>Speichern</span>
                        </button>
                        <button className="big-button cl-red" onClick={() => {
                            setAddProp(-1);
                        }} tabIndex={0}>
                            <span>Abbrechen</span>
                        </button>
                    </div>
                </> : null}
                {propList ? (propList.length ? propList.map(_ => <div className="item" key={_.prop} onClick={() => selectProp(_.prop)}>
                    {_.prop} ({_.valueType}:{_.value})
                </div>) : "no items") : "loading"}
            </div>
        </>
    }
}