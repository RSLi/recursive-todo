import { writable } from 'svelte/store';
import uuidv4 from 'uuid/v4';

/**
 * Todo object
 */
class Todo {
    constructor(title, parent) {
        this.id = uuidv4();
        this.parent = parent && parent.id || undefined; // id of parent Todo.
        this.title = title || '';
        this.isCompleted = false;
    }

    updateTitle(newTitle) {
        this.title = newTitle;
        return this;
    }

    complete() {
        this.isCompleted = true;
        return this;
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

    addTodo(todoObject) {
        return new TodoList([...this.items, todoObject]);
    }

    removeTodo(todoObject) {
        const newItems = this.items.filter(todo => todo.id !== todoObject.id);
        // TODO: return new TodoList(this.removeOrphanedTodo(newItems));
        return new TodoList(newItems);
    }

    completeTodo(todoObject) {
        const newItems = this.items.map(todo => {
            if (todo.id === todoObject.id) {
                return todo.complete();
            }

            return todo;
        });
        return new TodoList(newItems);
    }

    undoCompleteTodo(todoObject) {
        const newItems = this.items.map(todo => {
            if (todo.id === todoObject.id) {
                todo.isCompleted = false;
                return todo;
            }

            return todo;
        });
        return new TodoList(newItems);
    }

    updateTitle(todoObject, newTitle) {
        return new TodoList(this.items.map(todo => {
            if (todo.id === todoObject.id) {
                return todo.updateTitle(newTitle);
            }

            return todo;
        }));
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
        undoCompleteTodo: (todoObject) => {
            update(current => current.undoCompleteTodo(todoObject));
        },
        updateTitle: (todoObject, newTitle) => {
            update(current => current.updateTitle(todoObject, newTitle));
        },
        clear: () => set(new TodoList()),
    };
}

export const todoListStore = createTodoListStore();