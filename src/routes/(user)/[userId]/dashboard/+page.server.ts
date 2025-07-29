import { getAllUserProjects } from "$lib/api/project.svelte"
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ cookies, params }: Parameters<PageServerLoad>[0]) => {
	// await getAllUserProjects(params.userId)
	return {
		userToken : cookies.get('UserToken'),
		projects : [{imageUrl: '', projectName: 'prova1', lastModified: '11/11/2002'}]
	};
};