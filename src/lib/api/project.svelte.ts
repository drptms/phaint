import { error } from "@sveltejs/kit";

function createGetRequest(url: string, headers?: Headers) {
    return new Request(url, {
        method: 'GET',
        headers: headers,
    })
}

async function getProjectById(id: string) {
    try {
        let response = await fetch("" + id);
        if (!response.ok) {
            throw error(500, "Failed to fetch API");
        }
        let data = response.json();
        return data; 
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllUserProjects(userId: string) {
    try {
        let response = await fetch(createGetRequest("" + userId));
        if (!response.ok) {
            throw error(500, "Failed to fetch API");
        }
        let data = response.json();
        return data; 
    } catch (error) {
        console.error(error);
        return null;
    }
}