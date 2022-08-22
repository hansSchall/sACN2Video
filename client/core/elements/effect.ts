class EffectElmnt extends Elmnt {
    constructor(id: string, props: Prop[]) {
        super(id);
        props.forEach(this.initPar.bind(this));
    }
    getTransformMatrices(): [number[] | null, number[] | null] {
        return [m3.empty(), m3.empty()];
    }
}