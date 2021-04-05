export function ltrim(str) {
    if (!str) return str;
    return str.replace(/^\s+/g, '');
}

export function divideIntoSentences(text) {
    let result = text.match( /[^\.!\?]+[\.!\?]+/g );
    result = result.map(sentence => ltrim(sentence))
    return result;
}

