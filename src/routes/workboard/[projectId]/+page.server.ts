import { CreateInvitationLink } from '$lib/api/project.svelte';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const projectId = params.projectId;
	const userId = cookies.get('userId') || null;
	const username = cookies.get('username') || 'Anonymous';
	const projectName = url.searchParams.get('name');

	// Return data needed by the client component
	return { projectId, userId, username, projectName };
};

export const actions = {
	createInvitationLink: async ({ cookies, request }) => {
		let data = await request.formData();
		let userId = cookies.get('userId') as string;
		let projectId = data.get('projectId') as string;
		return await CreateInvitationLink(userId, projectId);
	}
} satisfies Actions;
