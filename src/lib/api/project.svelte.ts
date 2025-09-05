import { error } from '@sveltejs/kit';
import { LOCAL_API_KEY } from '$env/static/private';

function createGetRequest(url: string, headers?: Headers) {
	return new Request(url, {
		method: 'GET',
		headers: headers
	});
}

async function getProjectById(id: string) {
	// try {
	// 	let response = await fetch('' + id);
	// 	if (!response.ok) {
	// 		throw error(500, 'Failed to fetch API');
	// 	}
	// 	return response.json();
	// } catch (error) {
	// 	console.error(error);
	// 	return null;
	// }
}

export async function getAllUserProjects(userId: string) {
	// try {
	// 	let response = await fetch(createGetRequest(LOCAL_API_KEY + userId));
	// 	if (!response.ok) {
	// 		throw error(500, 'Failed to fetch API');
	// 	}
	// 	return response.json();
	// } catch (error) {
	// 	console.error(error);
	// 	return null;
	// }
}

export async function addProject(userId: string, projectName: string) {
	try {
		const headers: Headers = new Headers();
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');

        const date = new Date();
        const today = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();

		const request: RequestInfo = new Request(LOCAL_API_KEY + '/projects', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ UID: userId, "projectName": projectName, "creationDate": today })
		});

        return await fetch(request).then(async (res) => {
            return await res.json();
        });
    } catch (error) {
		console.error(error);
		return null;
	}
}
