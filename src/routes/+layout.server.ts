import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const userToken = cookies.get('UserToken');
    
    return {
        userToken
    };
}) satisfies LayoutServerLoad;
