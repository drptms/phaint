import { addProject, getAllUserProjects } from '$lib/api/project.svelte';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
	let userProjects = await getAllUserProjects(params.userId);
	let username = cookies.get("username");
	let uid = cookies.get("UserToken")
	console.log(userProjects)
	return {
		uid,
		username,
		userProjects
	};
};

export const actions = {
	addProject: async ({ cookies, request }) => {
		let data = await request.formData();
		let uid = cookies.get('UserToken') as string;
		let pid = data.get('pid') as string;
		let pname = data.get('pname') as string;

		await addProject(uid, pid, pname);
	}
} satisfies Actions;