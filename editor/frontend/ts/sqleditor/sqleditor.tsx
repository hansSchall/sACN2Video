import Table from "./table.js";

export function SQLEditor() {
    const [sql, setSQL] = React.useState("");
    const [result, setResult] = React.useState<string | JSX.Element>("");
    function runSQL(sql: string) {

        function resultFormat(result: any) {
            if (Array.isArray(result)) {
                setResult(<Table data={result} />)
            } else {
                setResult(JSON.stringify(result));
            }
        }

        preload.runSQL(sql).then(res => {
            resultFormat(res);
        })

        setResult("running " + sql + " ...");
    }
    return <>
        <header className="article-heading">Run SQL</header>
        <div className="article-toolbar">
            <div className="tool" onClick={() => {
                runSQL("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY 1;");
                setSQL("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY 1;");
            }}>
                <i className="bi-list"></i>
            </div>
            {/*
             <div className="tool" onClick={() => select(-1)}>
                <i className="bi-plus-lg"></i>
            </div>
        */}
        </div>
        <div className="content">
            {/* <div className="item-label">Name</div> */}
            <input className="item" autoFocus={true} value={sql} placeholder="SQL" onChange={ev => setSQL(ev.target.value)} onKeyUp={ev => { if (ev.key == "Enter") runSQL(sql) }}></input>
            <div className="buttonArea">
                <button className="big-button cl-green" onClick={() => runSQL(sql)} tabIndex={0}>
                    <span>Run</span>
                </button>
                <button className="big-button cl-red" onClick={() => {
                    setSQL("");
                    setResult("");
                }} tabIndex={0}>
                    <span>Löschen</span>
                </button>
            </div>
            <div style={{
                fontFamily: "monospace"
            }}>
                {result}
            </div>
        </div>
    </>
}
