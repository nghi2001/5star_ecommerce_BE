export const to = (promise: Promise<any>) => {
    return promise
        .then(data => [undefined, data])
        .catch(err => [err, undefined])
} 