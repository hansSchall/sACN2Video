function createValueMapping(input: string, output: string): (value: string | number) => string | number {
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
        if (typeof value == "string") {
            const valueAsNumber = +value;
            if (!isNaN(valueAsNumber))
                value = valueAsNumber;
        }
        let directMapping = mappingDatabase.find(_ => _[0] == value);
        if (directMapping) {
            return directMapping[1];
        } else {
            if (typeof value == "number") {
                const numbered = mappingDatabase.map(([inVal, outVal]) => [+inVal, outVal] as [number, string | number])

                let unBiggestRec = -Infinity,
                    unBiggestInd = NaN,
                    unSmallestRec = Infinity,
                    unSmallestInd = NaN;

                for (let i = 0; i < numbered.length; i++) {
                    const [inVal, outVal] = numbered[i];
                    if (isNaN(inVal))
                        continue;

                    if (inVal > value) {
                        if (inVal < unSmallestRec) {
                            unSmallestRec = inVal;
                            unSmallestInd = i;
                        }

                        if (inVal == unSmallestRec) {
                            // unSmallestInd.push(i);
                            unSmallestInd = i; // TODO multiple outVal for one inVal not supported yet
                        }
                    } else {
                        if (inVal > unBiggestRec) {
                            unBiggestRec = inVal;
                            unBiggestInd = i;
                        }

                        if (inVal == unBiggestRec) {
                            // unBiggestInd.push(i);
                            unBiggestInd = i; // TODO multiple outVal for one inVal not supported yet
                        }
                    }

                }

                let biggerRecValue = numbered[unBiggestInd][1];
                let smallerRecValue = numbered[unSmallestInd][1];

                if (typeof smallerRecValue == "string" && typeof biggerRecValue == "string") {
                    // get nearest
                    let biggerDis = Math.abs(unBiggestRec - value);
                    let smallerDis = Math.abs(unSmallestRec - value);
                    if (biggerDis > smallerDis) {
                        return smallerRecValue;
                    } else {
                        return biggerRecValue;
                    }
                } else if (typeof smallerRecValue == "number" && typeof biggerRecValue == "number") {
                    // interpolate
                    return interpolate(unSmallestRec, smallerRecValue, unBiggestRec, biggerRecValue, value);
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