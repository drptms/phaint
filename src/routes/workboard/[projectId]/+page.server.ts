import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const projectId = params.projectId;
	const userId = cookies.get('UserToken') || null;

	// Return data needed by the client component
	return { projectId, userId };
};