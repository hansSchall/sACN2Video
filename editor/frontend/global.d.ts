interface DBElsFormat {
    id: string
    type: string
    enabled: string
    zi: string
}
interface DBPropsFormat {
    el: string,
    prop: string,
    valueType: string,
    value: string,
}

declare const preload: {
    list: {
        els: () => Promise<DBElsFormat[]>,
        props: (el: string, prop?: string) => Promise<DBPropsFormat[]>,
    },
    put: {
        el: (el: DBElsFormat) => Promise<void>
        prop: (prop: DBPropsFormat) => Promise<void>
    },
    add: {
        el: (id: string, type: string) => Promise<void>,
        prop: (el: string, prop: string) => Promise<void>
    },
    delete: {
        el: (id: string) => Promise<boolean>,
        prop: (el: string, prop: string) => Promise<boolean>
    },
    getPreviewUrl: () => Promise<string>,
    getPreviewMode: () => Promise<boolean>,
    runSQL(sql: string): Promise<any>,
    assets: {
        list: () => Promise<string[]>,
        fileDialog: () => Promise<string>,
        add: (id: string, file: string, label: string, mime: string) => Promise<void>,
        delete: (id: string) => Promise<boolean>
    },
    isSplitscreenEnabled: () => Promise<boolean>;
}

declare type VoidFn = () => void;
