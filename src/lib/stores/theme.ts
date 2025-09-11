import { writable } from 'svelte/store';

export const darkMode = writable(false);

// Optional: persist theme across reloads
if (typeof window !== 'undefined') {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		darkMode.set(true);
	}
	darkMode.subscribe(value => {
		localStorage.setItem('theme', value ? 'dark' : 'light');
	});
}
