type CallOptions = {
    editor: boolean
    port: number,
    file: string,
    portCb: (port: number) => void,
    delayInit: boolean,
    randomPort: boolean
}
declare global {
    var callOptions: CallOptions | {
        delayInit: boolean,
    }
}
export { }