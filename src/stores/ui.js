import { writable } from 'svelte/store';

export const newTodoInput = writable('');

export const selectedTodo = writable(undefined);