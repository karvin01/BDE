import './style.css'

type Priority = 'Low' | 'Medium' | 'High';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
}

let todos: Todo[] = [];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const sortPriorityBtn = document.getElementById('sort-priority-btn') as HTMLButtonElement;

const addTodo = (text: string, priority: Priority): void => {
    const newTodo: Todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority
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

const sortTodosByPriority = (): void => {
    const priorityWeights: Record<Priority, number> = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    todos.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
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
                ${todo.text} [${todo.priority}]
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
    const priority = prioritySelect.value as Priority;

    if (text) {
        addTodo(text, priority);
        todoInput.value = '';
    }
});

if (sortPriorityBtn) {
    sortPriorityBtn.addEventListener('click', sortTodosByPriority);
}