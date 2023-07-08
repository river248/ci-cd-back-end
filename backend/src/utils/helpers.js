export const toTitleCase = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
            return word.replace(word[0], word[0].toUpperCase())
        })
        .join(' ')
}

export const asyncTimeout = async (ms) => {
    let timer = null
    return new Promise((resolve) => (timer = setTimeout(resolve, ms))).finally(() => clearTimeout(timer))
}
