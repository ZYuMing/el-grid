let deepCopy = (data) => {
    return JSON.parse(JSON.stringify(data))
}
let isEmpty = (data) => {
    if(data == null){
        return true
    }
    if(Array.isArray(data)){
        return !data.length
    }
    for (let key in data) {
        if (hasOwnProperty.call(data, key)) {
            return false
        }
    }
    return true
}
export default {
    deepCopy,
    isEmpty
}