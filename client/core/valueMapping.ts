function createValueMappingV1(input: string, output: string): (value: string | number) => string | number {
    const inputSplit = splitcomma(input);
    const outputSplit = splitcomma(output);
    const mappingDatabase: [string, string][] = [];
    if (inputSplit.length === outputSplit.length) {
        const l = inputSplit.length;
        for (let i = 0; i < l; i++) {
            mappingDatabase[i] = [inputSplit[i], outputSplit[i]];
        }
    } else {
        console.warn("range guessing is not supported yet")
        return _ => _;
    }

    return function (value: string | number) {
        value = convertToNumberIfPossible(value);
        let directMapping = mappingDatabase.find(_ => _[0] == value);
        if (directMapping) {
            return directMapping[1];
        } else {
            if (typeof value == "number") {
                const numbered = mappingDatabase.map(([inVal, outVal]) => [+inVal, outVal] as [number, string | number])

                let unNextBiggerRec = -Infinity,
                    unNextBiggerInd = NaN,
                    unNextSmallerRec = Infinity,
                    unNextSmallerInd = NaN;

                for (let i = 0; i < numbered.length; i++) {
                    const [inVal, outVal] = numbered[i];
                    if (isNaN(inVal))
                        continue;

                    if (inVal > value) {
                        if (inVal < unNextSmallerRec) {
                            unNextSmallerRec = inVal;
                            unNextSmallerInd = i;
                        }

                        if (inVal == unNextSmallerRec) {
                            // unSmallestInd.push(i);
                            unNextSmallerInd = i; // TODO multiple outVal for one inVal not supported yet
                        }
                    } else {
                        if (inVal > unNextBiggerRec) {
                            unNextBiggerRec = inVal;
                            unNextBiggerInd = i;
                        }

                        if (inVal == unNextBiggerRec) {
                            // unBiggestInd.push(i);
                            unNextBiggerInd = i; // TODO multiple outVal for one inVal not supported yet
                        }
                    }

                }

                let biggerRecValue = convertToNumberIfPossible(numbered[unNextBiggerInd][1]);
                let smallerRecValue = convertToNumberIfPossible(numbered[unNextSmallerInd][1]);

                if (typeof smallerRecValue == "string" && typeof biggerRecValue == "string") {
                    // get nearest
                    let biggerDis = Math.abs(unNextBiggerRec - value);
                    let smallerDis = Math.abs(unNextSmallerRec - value);
                    if (biggerDis > smallerDis) {
                        return smallerRecValue;
                    } else {
                        return biggerRecValue;
                    }
                } else if (typeof smallerRecValue == "number" && typeof biggerRecValue == "number") {
                    // interpolate
                    return interpolate(unNextSmallerRec, smallerRecValue, unNextBiggerRec, biggerRecValue, value);
                } else {
                    // value of string
                    if (typeof biggerRecValue == "number") {
                        return biggerRecValue;
                    } else if (typeof smallerRecValue == "number") {
                        return smallerRecValue;
                    }
                }

            } else {

            }
        }
        return value;
    }
}