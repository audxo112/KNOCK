export const DEBUG = true

export const PRIORITIES = (max) => {
    return [...Array(max).keys()].map(i => i + 1).map(
        item => {
            return {
                name: `중요도 ${item}`,
                value: item
            }
        }
    )
}