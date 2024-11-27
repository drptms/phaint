import { error } from "@sveltejs/kit";

async function registerUser(username: string, password: string) {
    try {
        let response = await fetch(createPostRequest("", JSON.stringify({username: username, password: password})));
        if (!response.ok) {
            throw error(500, "Error registering user");
        }
        let data = response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function authenticateUser(username: string, password: string) {
    try {
        let response = await fetch(createPostRequest("", JSON.stringify({username: username, password: password})));
        if (!response.ok) {
            throw error(500, "Error authenticating user");
        }
        let data = response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}