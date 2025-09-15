import { LOCAL_API_KEY } from '$env/static/private';

export async function getAllUserProjects(userId: string) {
	try {
		const headers: Headers = new Headers();
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');

		const request: RequestInfo = new Request(LOCAL_API_KEY + '/projects', {
			method: 'GET',
			headers: headers
		});

		return await fetch(request).then(async (res) => {
			let data =  await res.json();
			// @ts-ignore

			return {own: data.filter(value => value.UID == userId), shared: data.filter(value => value.Collaborators.includes(userId))};
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function addProject(userId: string, projectId: string, projectName: string) {
	try {
		const date = new Date();
		const today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

		const headers: Headers = new Headers();
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');

		const request: RequestInfo = new Request(LOCAL_API_KEY + '/projects', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ "UID": userId, "PID": projectId, "projectName": projectName, "CreationDate": today })
		});

		return await fetch(request).then(async (res) => {
			return await res.json();
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function acceptInvitation(userId: string, inviteLink: string) {
	try {
		const headers: Headers = new Headers();
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');
		const request: RequestInfo = new Request(LOCAL_API_KEY + '/invitations/accept', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ UID: userId, inviteLink: inviteLink })
		});
		return await fetch(request).then(async (res) => {
			return await res.json();
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function CreateInvitationLink(userId: string, projectId: string) {
	try {
		const headers: Headers = new Headers();
		headers.set('Content-Type', 'application/json');
		headers.set('Accept', 'application/json');

		const request: RequestInfo = new Request(LOCAL_API_KEY + '/invitations', {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({ "UID": userId, "PID": projectId })
		});
		return await fetch(request).then(async (res) => {
			return await res.json();
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}
