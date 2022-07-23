type CallOptions = {
    editor?: boolean
    port?: number,
    file?: string,
    portCb?: (port: number) => void,
    delayInit?: boolean,
    randomPort?: boolean
} | null
declare global {
    var callOptions: CallOptions
}
export { }