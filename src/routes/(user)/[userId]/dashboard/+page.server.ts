import { getAllUserProjects } from "$lib/api/project.svelte"
import type { PageLoad } from "./$types";


export const load: PageLoad = async ({ params }: Parameters<PageLoad>[0]) => {
	return {
		projects : await getAllUserProjects(params.userId)
	};
};