enum ParValueTypes {
    INT = 0,
    FLOAT = 1,
    STRING = 2,
}

class ParHelper {
    constructor(readonly propDef: Map<string, {
        type: ParValueTypes,
        defaultValue?: string | number,
        update?: VoidFunction
    }>) {

    }
    readonly props = new Map<string, {
        type: ParValueTypes,
        value: string | number,
        update: VoidFunction
    }>(
        [...this.propDef.entries()]
            .map(([name, { type, defaultValue, update }]) => [name, {
                type,
                value: defaultValue ?? (type === ParValueTypes.STRING ? "" : 0),
                update: update || (() => { }),
            }]));
    public valueUpdate(par: string, value: string | number, dyn?: boolean): boolean {
        const prop = this.props.get(par);
        if (prop) {
            let parsedVal: number | string;
            switch (prop.type) {
                case ParValueTypes.INT:
                    parsedVal = parseInt(value as string);
                    break;
                case ParValueTypes.FLOAT:
                    parsedVal = parseFloat(value as string);
                    break;
                case ParValueTypes.STRING:
                    parsedVal = value.toString();
                    break;
            }
            prop.value = parsedVal;
            prop.update();
            return true;
        } else {
            return false;
        }
    }
}