import { writable } from 'svelte/store';
import uuidv4 from 'uuid/v4';

/**
 * Immutable Todo object.
 */
class Todo {
    constructor(title, parent) {
        this.id = uuidv4();
        this.parent = parent && parent.id || undefined; // id of parent Todo.
        this.title = title || '';
        this.isCompleted = false;
    }

    complete() {
        const newTodo = new Todo(this.title, this.parent);
        newTodo.isCompleted = true;
        return newTodo;
    }
}

/**
 * TodoList with Immutable operations.
 * 
 * All member functions returns a new Immutable copy of TodoList.
 */
class TodoList {
    constructor(items) {
        this.items = items || [];
    }

    // TODO: rewrite this part.
    // This is an inefficient helper function that removes all dangling todos.
    // removeOrphanedTodo(itemList) {
    //     let hasOrphan = false;
    //     let filteredItems = [...itemList];
    //     for (todo of itemList) {
    //         // For each non-root todo item whose parent cannot be found.
    //         if (todo.parent && itemList.filter(t => t.id === todo.parent).length === 0) {
    //             hasOrphan = true;
    //             filteredItems = filteredItems.filter(t => t.id !== todo.id);
    //         }
    //     }

    //     // Recursively run again until no dangling todo.
    //     if (hasOrphan) {
    //         return this.removeOrphanedTodo(filteredItems);
    //     }

    //     return filteredItems;
    // }

    addTodo(todoObject) {
        return new TodoList([...this.items, todoObject]);
    }

    removeTodo(todoObject) {
        const newItems = this.items.filter(todo => todo.id !== todoObject.id);
        // return new TodoList(this.removeOrphanedTodo(newItems));
        return new TodoList(newItems);
    }

    completeTodo(todoObject) {
        const newItems = this.items.map(todo => {
            if (todo.id === todoObject.id) {
                return todoObject.complete();
            }

            return todo;
        });
        return new TodoList(newItems);
    }
}


function createTodoListStore() {
    const { subscribe, set, update } = writable(new TodoList());

    return {
        subscribe,
        addTodo: (title, parent) => {
            update(current => current.addTodo(new Todo(title, parent)));
        },
        removeTodo: (todoObject) => {
            update(current => current.removeTodo(todoObject));
        },
        completeTodo: (todoObject) => {
            update(current => current.completeTodo(todoObject));
        },
        clear: () => set(new TodoList()),
    };
}

export const todoListStore = createTodoListStore();