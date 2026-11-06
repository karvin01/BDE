import './style.css'

type Priority = 'Low' | 'Medium' | 'High';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    dueDate?: string;
}

let todos: Todo[] = [];

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const sortPriorityBtn = document.getElementById('sort-priority-btn') as HTMLButtonElement;

const isOverdue = (dueDateStr?: string): boolean => {
    if (!dueDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    return dueDate < today;
};

const addTodo = (text: string, priority: Priority, dueDate?: string): void => {
    const newTodo: Todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        dueDate: dueDate || undefined
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

        const overdue = !todo.completed && isOverdue(todo.dueDate);
        li.className = `todo-item ${overdue ? 'overdue' : ''}`;

        const dateText = todo.dueDate ? ` (Due: ${todo.dueDate}${overdue ? ' - OVERDUE' : ''})` : '';

        li.innerHTML = `
            <input type="checkbox" class="toggle-check" ${todo.completed ? 'checked' : ''}>
            <span style="${todo.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">
                ${todo.text} [${todo.priority}]${dateText}
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
    const dueDate = dueDateInput.value;

    if (text) {
        addTodo(text, priority, dueDate);
        todoInput.value = '';
        dueDateInput.value = '';
    }
});

if (sortPriorityBtn) {
    sortPriorityBtn.addEventListener('click', sortTodosByPriority);
}