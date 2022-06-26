import { AddAsset } from "./add.asset.js";
import { AssetDetails } from "./detail.assets.js";

export function Assets() {
    function loadList() {
        updateList(null);
        preload.assets.list().then(updateList);
    }
    const [assets, updateList] = React.useState<string[] | null>(null);
    const [selected, select] = React.useState<string | -1>(-1);
    React.useEffect(loadList, [selected]);
    if (selected) {
        if (selected === -1) {
            return <>
                <header className="article-heading">Assets</header>
                <div className="article-toolbar">
                    <div className="tool" onClick={loadList}>
                        <i className="bi-arrow-clockwise"></i>
                    </div>
                    <div className="tool" onClick={() => select("")}>
                        <i className="bi-plus-lg"></i>
                    </div>
                </div>
                <div className="content">
                    {assets ? (assets.length ? assets.map(asset => <div key={asset} className="item" onClick={() => select(asset)}>{asset}</div>) : "no items") : "loading ..."}
                </div>
            </>
        } else {
            return <AssetDetails id={selected} back={() => select(-1)} />
        }
    } else {
        return <AddAsset back={() => {
            select(-1)
        }}></AddAsset>
    }
}