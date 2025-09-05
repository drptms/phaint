import type { Actions } from './$types';
import { registerUser } from '$lib/api/auth.svelte';
import jwt from 'jsonwebtoken';

export const actions = {
	register: async ({ cookies, request }) => {
		let data = await request.formData();
		let mail = data.get('mail') as string;
		let username = data.get('username') as string;
		let password = data.get('password') as string;

		let response = await registerUser(username, mail, password);
		if (response != null) {
			const decoded = jwt.decode(response.UserToken) as any;
			cookies.set('UserToken', decoded.user_id, { path: '/' });
			cookies.set('username', response.username, { path: '/' });
		}
	}
} satisfies Actions;
