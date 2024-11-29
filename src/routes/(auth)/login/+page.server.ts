import type { Actions } from './$types';
import { authenticateUser } from '$lib/api/auth.svelte'

export const actions = {
	login: async ({cookies, request}) => {
        let data = await request.formData();
        let username = data.get('username') as string;
        let password = data.get('password') as string;
		console.log("User " + username + " logged in!");

        await authenticateUser(username, password);
	}
} satisfies Actions;