import { PropForm } from "./prop.form.js";
export function PropEditor(props) {
    const title = props.el + "." + props.prop;
    const [values, setValues] = React.useState(null);
    React.useEffect(() => {
        setValues(null);
        preload.list.props(props.el, props.prop).then(values => {
            setValues([values[0].valueType, values[0].value]);
        });
    }, [title]);
    if (values) {
        return React.createElement(PropForm, { title: title, back: props.back, deleteProp: () => {
                preload.delete.prop(props.el, props.prop)
                    .then(_ => _ ? props.back() : null);
            }, save: async (valueType, value) => {
                setValues(null);
                preload.put.prop({
                    el: props.el,
                    prop: props.prop,
                    valueType,
                    value,
                }).then(() => {
                    props.back();
                });
            }, el: props.el, prop: props.prop, valueType: values[0], value: values[1] });
    }
    else {
        return React.createElement(React.Fragment, null,
            React.createElement("header", { className: "article-heading" }, title),
            React.createElement("div", { className: "article-toolbar" },
                React.createElement("div", { className: "tool", onClick: props.back },
                    React.createElement("i", { className: "bi-chevron-left" }))),
            React.createElement("div", { className: "content" }, "loading"));
    }
}
