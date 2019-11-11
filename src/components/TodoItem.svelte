<script>
    import { selectedTodo } from '../stores/ui.js';
    import { todoListStore } from '../stores/todo.js';

    export let todo;

    let mode = 'VIEW'; // mode can be 'VIEW' or 'EDIT'
    let editTextAreaValue = '';

    $: barColor = todo.isCompleted ? 'gray' : 'purple';

    function handleSelection() {
        $selectedTodo = todo;
    }

    function handleDelete() {
        todoListStore.removeTodo(todo);
        $selectedTodo = undefined;
    }

    function handleComplete() {
        if (todo.isCompleted) {
            todoListStore.undoCompleteTodo(todo);
        } else {
            todoListStore.completeTodo(todo);
        }
    }

    function handleUpdateTitle(newTitle) {
        todoListStore.updateTitle(todo, newTitle);
    }

</script>

<style>
.todoitem {
    width: 80%;
    min-height: 80px;
    padding: 0;
    margin: 10px 10px 10px 10px;
    border-radius: 5px;
    box-shadow: 0px 5px 15px -2px rgba(0,0,0,0.75);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
}
.todoitem--active {
    background: lightblue;
}

.todoitem__body {
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
}

.todoitem__left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.todoitem__rightbar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: stretch;
    max-width: 30px;
    background-color: var(--bar-color);
}

.todoitem__rightbar button {
    width: 100%;
    color: white;
}

.todoitem__leftbar {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    min-width: 30px;
    max-width: 40px;
    background-color: var(--bar-color);
}

.todoitem__leftbar button {
    width: 100%;
    color: white;
}
</style>

<div class="todoitem" style="--bar-color: {barColor}" class:todoitem--active={$selectedTodo && $selectedTodo.id === todo.id}>
    {#if mode === 'VIEW'}
        <div class="todoitem__left">
            <div class="todoitem__leftbar" on:click={handleComplete}>
                <button>{#if todo.isCompleted}☑{:else}☐{/if}</button>
            </div>
            <div class="todoitem__body">
                {todo.title}
            </div>
        </div>
        <div class="todoitem__rightbar">
            <button on:click={handleSelection}>⇨</button>
            <button
                on:click={() => {
                    editTextAreaValue = todo.title;
                    mode = 'EDIT';
                }}
            >✐</button>
            <button on:click={handleDelete}>⨯</button>
        </div>
    {/if}
    {#if mode === 'EDIT'}
        <div class="todoitem__body">
            <textarea bind:value={editTextAreaValue}></textarea>
        </div>
        <div class="todoitem__rightbar">
            <button on:click={() => {
                    handleUpdateTitle(editTextAreaValue);
                    mode = 'VIEW';
                }}
            >✔</button>
        </div>
    {/if}
</div>