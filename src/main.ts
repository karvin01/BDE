import './style.css'

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;

const addTodo = (text: string): void => {
    const newTodo: Todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    renderTodos();
};

const toggleTodo = (id: number): void => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
};

const removeTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
};

const renderTodos = (): void => {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        li.innerHTML = `
            <input type="checkbox" class="toggle-check" ${todo.completed ? 'checked' : ''}>
            <span style="${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                ${todo.text}
            </span>
            <button class="remove-btn">Remove</button>
        `;

        const checkbox = li.querySelector('.toggle-check') as HTMLInputElement;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const removeButton = li.querySelector('.remove-btn') as HTMLButtonElement;
        removeButton.addEventListener('click', () => removeTodo(todo.id));

        todoList.appendChild(li);
    });
};

todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const text = todoInput.value;
    if (text) {
        addTodo(text);
        todoInput.value = '';
    }
});