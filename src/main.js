import App from './App.svelte';
import { todoListStore } from './stores/todo.js';

// Check localStorage to see if there is saved data.
todoListStore.loadFromLocalStorageIfAvailable();

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;