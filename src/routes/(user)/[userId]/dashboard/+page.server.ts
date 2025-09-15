import { acceptInvitation, addProject, getAllUserProjects } from '$lib/api/project.svelte';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
	let userProjects = await getAllUserProjects(params.userId);
	let username = cookies.get("username");
	let uid = cookies.get("userId");
	if (!userProjects) {
		userProjects = { own: [], shared: [] };
	}
	return {
		uid,
		username,
		own: userProjects.own,
		shared: userProjects.shared
	};
};

export const actions = {
	addProject: async ({ cookies, request }) => {
		let data = await request.formData();
		let uid = cookies.get('userId') as string;
		let pid = data.get('pid') as string;
		let pname = data.get('pname') as string;

		await addProject(uid, pid, pname);
	},
	acceptInvitation: async ({ cookies, request }) => {
		let data = await request.formData();
		let uid = cookies.get('userId') as string;
		let invite = data.get('invite') as string;

		await acceptInvitation(uid, invite);
	}
} satisfies Actions;
