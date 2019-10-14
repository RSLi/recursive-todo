<script>
    import { selectedTodo } from '../stores/ui.js';

    export let todo;

    function handleSelection() {
        $selectedTodo = todo;
    }
</script>

<style>
.todoitem {
    width: 80%;
    min-height: 80px;
    padding: 20px 20px 20px 20px;
    margin: 10px 10px 10px 10px;
    border-radius: 5px;
    box-shadow: 0px 15px 22px -13px rgba(0,0,0,0.75);
}
.active {
    background: gray;
}
</style>

<div class="todoitem" class:active={$selectedTodo && $selectedTodo.id === todo.id} on:click={handleSelection}>
    {todo.title}
</div>