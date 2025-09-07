import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const userId = cookies.get('userId');

	return {
		userId
	};
}) satisfies LayoutServerLoad;
