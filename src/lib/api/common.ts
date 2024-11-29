function createGetRequest(url: string, headers?: Headers) {
    return new Request(url, {
        method: 'GET',
        headers: headers,
    })
}

function createPostRequest(url: string, body: any ,headers?: Headers) {
    return new Request(url, {
        method: 'POST',
        headers: headers,
        body: body,
    })
}