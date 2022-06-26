export function AssetDetails(props: {
    id: string,
    back: VoidFn,
}) {
    return <>
        <header className="article-heading">Details for {props.id}</header>
        <div className="article-toolbar">
            <div className="tool" onClick={props.back}>
                <i className="bi-chevron-left"></i>
            </div>
            <div className="tool" onClick={() => {
                preload.assets.delete(props.id).then(_ => _ ? props.back() : null)
            }}>
                <i className="bi-trash"></i>
            </div>
        </div>
        <div className="content">
            <div className="item-label">Name</div>
            <div className="item">{props.id}</div>
            {/* {assets ? (assets.length ? assets.map(asset => <div key={asset} className="item" onClick={() => select(asset)}>{asset}</div>) : "no items") : "loading ..."} */}
        </div>
    </>
}