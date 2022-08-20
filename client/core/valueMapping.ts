function createValueMapping(input: string, output: string): (value: string | number) => string | number {
    return function (value: string | number) {
        return value;
    }
}