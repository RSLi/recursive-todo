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

    saveToLocalStorage(items) {
        window.localStorage.setItem('recursive-todo-save', JSON.stringify(items));
    }

    addTodo(todoObject) {
        const newItems = [...this.items, todoObject];
        this.saveToLocalStorage(newItems);
        return new TodoList(newItems);
    }

    removeTodo(todoObject) {
        const newItems = this.items.filter(todo => todo.id !== todoObject.id);
        // TODO: return new TodoList(this.removeOrphanedTodo(newItems));
        this.saveToLocalStorage(newItems);
        return new TodoList(newItems);
    }

    completeTodo(todoObject) {
        const newItems = this.items.map(todo => {
            if (todo.id === todoObject.id) {
                return todo.complete();
            }

            return todo;
        });
        this.saveToLocalStorage(newItems);
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
        this.saveToLocalStorage(newItems);
        return new TodoList(newItems);
    }

    updateTitle(todoObject, newTitle) {
        const newItems = this.items.map(todo => {
            if (todo.id === todoObject.id) {
                return todo.updateTitle(newTitle);
            }

            return todo;
        });
        this.saveToLocalStorage(newItems);
        return new TodoList(newItems);
    }
}


function createTodoListStore() {
    const { subscribe, set, update } = writable(new TodoList());

    return {
        subscribe,
        update,
        set,
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
        loadFromLocalStorageIfAvailable: () => {
            const savedData = window.localStorage.getItem('recursive-todo-save');
            if (savedData) {
                set(new TodoList(JSON.parse(savedData)));
            } else {
                console.log('No save found.');
            }
        },
        clear: () => set(new TodoList()),
    };
}

export const todoListStore = createTodoListStore();