class EffectElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        props.forEach(this.initPar.bind(this));
    }
    getTransformMatrices(): [number[] | null, number[] | null] {
        return [null, null];
    }
}
