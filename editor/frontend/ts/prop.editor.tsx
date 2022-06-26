import { PropForm } from "./prop.form.js"

export function PropEditor(props: {
    el: string,
    prop: string,
    back: VoidFn
}) {
    const title = props.el + "." + props.prop;
    const [values, setValues] = React.useState<[string, string] | null>(null);
    React.useEffect(() => {
        setValues(null);
        preload.list.props(props.el, props.prop).then(values => {
            setValues([values[0].valueType, values[0].value]);
        })
    }, [title]);
    if (values) {
        return <PropForm title={title} back={props.back} deleteProp={() => {
            preload.delete.prop(props.el, props.prop)
                .then(_ => _ ? props.back() : null);
        }} save={async (valueType, value) => {
            setValues(null);
            preload.put.prop({
                el: props.el,
                prop: props.prop,
                valueType,
                value,
            }).then(() => {
                props.back();
            })

        }} el={props.el} prop={props.prop} valueType={values[0]} value={values[1]} />
    } else {
        return <>
            <header className="article-heading">{title}</header>
            <div className="article-toolbar">
                <div className="tool" onClick={props.back}>
                    <i className="bi-chevron-left"></i>
                </div>
            </div>
            <div className="content">
                loading
            </div>
        </>
    }
}