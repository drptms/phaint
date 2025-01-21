import { error } from "@sveltejs/kit";
import { LOCAL_API_KEY } from "$env/static/private";

export async function registerUser(username: string, mail: string, password: string) {
    try {
        const headers: Headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')

        console.log(username, mail, password)

        const request: RequestInfo = new Request(LOCAL_API_KEY + "/users/register", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ username: username, mail: mail, password: password })
        })

        const result = await fetch(request)
            .then(async res => {
                const data = await res.json();
                return data;
            })
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function authenticateUser(username: string, mail: string, password: string) {
    try {
        const headers: Headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')

        console.log(username, mail, password)

        const request: RequestInfo = new Request(LOCAL_API_KEY + "/users/login", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ username: username, mail: mail, password: password })
        })

        const result = await fetch(request)
            .then(async res => {
                const data = await res.json();
                return data;
            })
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
}