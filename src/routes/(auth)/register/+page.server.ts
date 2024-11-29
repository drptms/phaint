import type { Actions } from './$types';
import { registerUser } from '$lib/api/auth.svelte'

export const actions = {
    register: async ({cookies, request}) => {
        let data = await request.formData();
        let username = data.get('username') as string;
        let password = data.get('password') as string;
        console.log("User " + username + " registered in!");

        await registerUser(username, password);
    }
} satisfies Actions;