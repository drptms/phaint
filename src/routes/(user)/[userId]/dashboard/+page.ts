import { getAllUserProjects } from "$lib/api/project.svelte"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types";


export const load: PageLoad = async ({ params }) => {
	return {
		projects : await getAllUserProjects(params.userId)
	};
};