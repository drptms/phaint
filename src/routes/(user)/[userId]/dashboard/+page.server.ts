import { addProject, getAllUserProjects } from '$lib/api/project.svelte';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
	// await getAllUserProjects(params.userId)
	console.log(cookies)
	return {
		userId: cookies.get('userToken'),
		username: cookies.get('username'),
		projects: [{ imageUrl: '', projectName: 'prova1', lastModified: '11/11/2002' }]
	};
};

export const actions = {
	addProject: async ({ cookies, request }) => {
		let data = await request.formData();
		let uid = cookies.get('userToken') as string;
		let pid = data.get('pid') as string;
		let pname = data.get('pname') as string;

		await addProject(uid, pid);
	}
} satisfies Actions;