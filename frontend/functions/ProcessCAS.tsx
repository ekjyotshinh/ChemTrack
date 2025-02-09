// Adds dashes to the CAS number
const processCAS = (CAS: string) => {
    if (CAS.length === 0) return 'Unknown'

    let result = ''
    let string = CAS.toString()

    for (let i = 0; i < string.length; i++) {
        if (i === string.length - 1 || i === string.length - 3) {
            result += '-'
        }
        result += string[i]
    }
    return result
}

export default processCAS