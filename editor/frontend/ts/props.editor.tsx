export function PropsEditor() {
    const [selectedElement, selectElement] = React.useState("");
    const [elList, updateellist] = React.useState([]);
    if (selectedElement) {
        return <>
            <header className="article-heading">{selectedElement}</header>
            <div className="article-toolbar">
                <div className="tool" onClick={() => selectElement("")}>
                    <i className="bi-chevron-left"></i>
                </div>
                <div className="tool">
                    <i className="bi-arrow-clockwise"></i>
                </div>
                <div className="tool">
                    <i className="bi-plus-lg"></i>
                </div>
                <div className="tool">
                    <i className="bi-trash"></i>
                </div>
            </div>
        </>
    } else {
        return <>
            <header className="article-heading">Objekte</header>
            <div className="article-toolbar">
                <div className="tool">
                    <i className="bi-arrow-clockwise"></i>
                </div>
                <div className="tool">
                    <i className="bi-plus-lg"></i>
                </div>
            </div>
            <div className="content">
                {elList.length ? elList.map(_ => <div className="item" onClick={() => selectElement(_)}>
                    {_}
                </div>) : ("loading or nothing to show")}
            </div>
        </>
    }
}