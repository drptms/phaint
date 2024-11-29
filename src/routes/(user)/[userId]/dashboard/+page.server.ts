import { getAllUserProjects } from "$lib/api/project.svelte"
import type { PageLoad } from "./$types";


export const load: PageLoad = async ({ params }) => {
	return {
		projects : await getAllUserProjects(params.userId)
	};
};