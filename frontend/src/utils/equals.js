const isObject = (obj) => {
    return obj !== null && typeof obj === "object"
}

export const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true
    if (obj1 === null || obj2 === null) return false

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) {
        return false
    }

    for (const key of keys1) {
        const val1 = obj1[key]
        const val2 = obj2[key]

        const areObjects = isObject(val1) && isObject(val2)
        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false
        }
    }
    return true
}

export const arraysEqual = (arr1, arr2) => {
    if (arr1 === arr2) return true
    if (arr1 === null || arr2 === null) return false

    if (arr1.length !== undefined) {
        if (arr1.length !== arr2.length) return false
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false
        }
    }
    else if (arr1.size !== undefined) {
        if (arr1.size !== arr2.size) return false
        for (let i = 0; i < arr1.size; i++) {
            if (arr1.get(i) !== arr2.get(i)) return false
        }
    }

    return true
}