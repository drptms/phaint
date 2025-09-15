import type { Actions } from './$types';

export const actions = {
	logout: async ({ cookies, request }) => {
		cookies.delete('userId', { path: '/' });
		cookies.delete('username', { path: '/' });
	}
} satisfies Actions;
