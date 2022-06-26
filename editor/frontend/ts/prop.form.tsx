import { Bi } from "./bi.js";

export function PropForm(props: {
    title: string,
    deleteProp: VoidFn,
    valueType: string,
    value: string,
    el: string,
    prop: string,
    save: (valueType: string, value: string) => void,
    back: VoidFn,
}) {
    const [valueType, setValueType] = React.useState(props.valueType);
    const [value, setValue] = React.useState(props.value);
    function save() {
        props.save(valueType, value)
    }
    return <>
        <header className="article-heading">{props.title}</header>
        <div className="article-toolbar">
            <div className="tool" onClick={props.back}>
                <i className="bi-chevron-left"></i>
            </div>
            <div className="tool" onClick={props.deleteProp}>
                <i className="bi-trash"></i>
            </div>
        </div>
        <div className="content">
            <div className="item-label">Element</div>
            <div className="item">{props.el}</div>
            <div className="item-label">Eigenschaft</div>
            <div className="item">{props.prop}</div>
            <div className="item-label">valueType</div>
            <input className="item" autoFocus={true} value={valueType} onChange={ev => setValueType(ev.target.value)}></input>
            <div className="item-label">Value</div>
            <input className="item" value={value} onChange={ev => setValue(ev.target.value)} onKeyUp={ev => { if (ev.key == "Enter") save() }}></input>
        </div>
        <div className="buttonArea">
            <button className="big-button cl-orange" onClick={save} tabIndex={0}>
                <span>Speichern</span>
            </button>
        </div>
    </>
}