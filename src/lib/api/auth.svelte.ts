import { LOCAL_API_KEY } from '$env/static/private';

export async function registerUser(username: string, mail: string, password: string) {
    try {
        const headers: Headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')

        const request: RequestInfo = new Request(LOCAL_API_KEY + '/users', {
					method: 'POST',
					headers: headers,
					body: JSON.stringify({ username: username, mail: mail, password: password })
				});
        
        return await fetch(request)
					.then(async res => {
						return await res.json();
					});
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function authenticateUser(mail: string, password: string) {
    try {
			const headers: Headers = new Headers();
			headers.set('Content-Type', 'application/json');
			headers.set('Accept', 'application/json');

			const request: RequestInfo = new Request(LOCAL_API_KEY + '/users', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({ mail: mail, password: password })
			});

			return await fetch(request).then(async (res) => {
				return await res.json();
			});
		} catch (error) {
        console.error(error);
        return null;
    }
}