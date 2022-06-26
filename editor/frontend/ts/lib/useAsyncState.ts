export default function useAsyncState<T, D>(fn: () => Promise<T>, defaultValue: D) {
    const [state, setState] = React.useState<T | D>()
}