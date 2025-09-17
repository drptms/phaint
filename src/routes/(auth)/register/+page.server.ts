import type { Actions } from './$types';
import { registerUser } from '$lib/api/auth.svelte';

export const actions = {
	register: async ({ cookies, request }) => {

		let data = await request.formData();
		let mail = data.get('mail') as string;
		let username = data.get('username') as string;
		let password = data.get('password') as string;

		let response = await registerUser(username, mail, password);

		if (response != null) {
			cookies.set('userId', response.userId, { path: '/' });
			cookies.set('username', response.username, { path: '/' });
		}
	}
} satisfies Actions;
