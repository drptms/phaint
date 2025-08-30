import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import jwt, { decode } from 'jsonwebtoken';
import { authenticateUser } from '$lib/api/auth.svelte'

export const actions = {
	login: async ({cookies, request}) => {
        let data = await request.formData();
        let mail = data.get('mail') as string;
        let password = data.get('password') as string;

        let response = await authenticateUser(mail, password);
        if (response != null) {
            const decoded = jwt.decode(response.UserToken) as any;
            cookies.set("UserToken", decoded.user_id , {path: "/"});
            cookies.set("username", response.username, {path: "/"});
        }       
	}
} satisfies Actions;