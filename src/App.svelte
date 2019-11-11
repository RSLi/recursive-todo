<svelte:options immutable={true}/>

<script>
	import { todoListStore } from './stores/todo.js';
	import { newTodoInput, selectedTodo } from './stores/ui.js';
	import TodoItem from './components/TodoItem.svelte';
	import GithubCorner from './components/GithubCorner.svelte';


	function handleDelete() {
		todoListStore.removeTodo($selectedTodo);
		$selectedTodo = undefined;
	}

	function handleSubmit() {
		todoListStore.addTodo($newTodoInput, $selectedTodo);
		$newTodoInput = '';
	}

	function handleBack() {
		$selectedTodo = undefined;
	}

	let itemsInView = [];

	$: {
		if ($selectedTodo) {
			itemsInView = $todoListStore.items.filter(t => t.parent === $selectedTodo.id);
		} else {
			itemsInView = $todoListStore.items.filter(t => t.parent === undefined);
		}
	}

</script>

<style>
.container {
	display: flex;
	flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
	background: pink;
}
.column {
	width: 400px;
	height: 80vh;
	background: white;
	border-radius: 20px;
	box-shadow: 0px 10px 16px -6px rgba(0,0,0,0.75);
	overflow-y: auto;
}

.column__header {
	margin: 30px 20px 30px 20px;
}

.column__header form {
	width: 100%;
}

.column__header button {
	padding: 5px 5px 5px 5px;
	background-color: coral;
	color: white;
}

input {
	width: 100%;
}
</style>

<GithubCorner></GithubCorner>

<div class="container">
	{#if $selectedTodo}
		<div class="column">
			<!-- <button on:click={handleDelete}>Delete</button> -->
			<TodoItem todo={$selectedTodo} />
		</div>
	{/if}

	<div class="column">
		<div class="column__header">
			{#if $selectedTodo}
				<button on:click={handleBack}>Back to top</button>
			{/if}
			<form on:submit|preventDefault={handleSubmit}>
				<input bind:value={$newTodoInput} placeholder="Input todo and press enter">
			</form>
		</div>

		{#each itemsInView as todo (todo.id)}
			<TodoItem todo={todo} />
		{/each}
	</div>
</div>