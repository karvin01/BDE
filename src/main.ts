import './style.css'

// Union type
type Priority = 'Low' | 'Medium' | 'High';

// Interface structure of the data schema with optional property dueDate
interface Todo {
    id: number;
    text: string;
    completed: boolean;
    priority: Priority;
    dueDate?: string;
}

const STORAGE_KEY = 'todos_app_data';

const loadTodosFromStorage = (): Todo[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
};

const saveTodosToStorage = (): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

let todos: Todo[] = loadTodosFromStorage();

// DOM selection with typecasting
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const dueDateInput = document.getElementById('due-date-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const sortPriorityBtn = document.getElementById('sort-priority-btn') as HTMLButtonElement;
const clearStorageBtn = document.getElementById('clear-storage-btn') as HTMLButtonElement;

/**
 * Checks whether a given ISO date string is before the current day at midnight.
 * Sub-feature of Option 6 (Highlight overdue todos).
 */
const isOverdue = (dueDateStr?: string): boolean => {
    if (!dueDateStr) return false;
    // Compare date parts directly at midnight to avoid timezone issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    return dueDate < today;
};

// Add todos function
const addTodo = (text: string, priority: Priority, dueDate?: string): void => {
    const newTodo: Todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        dueDate: dueDate || undefined
    };

    todos.push(newTodo);
    saveTodosToStorage();
    renderTodos();
};

// Toggle complete status of the task (Option 1)
const toggleTodo = (id: number): void => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodosToStorage();
    renderTodos();
};

// Remove todo
const removeTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToStorage();
    renderTodos();
};

// Option 14: Clear all todos from local storage
const clearAllStorage = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    todos = [];
    renderTodos();
};

// Sort order direction tracking
let isSortAscending: boolean = false;

// Sort todos by priority: toggles between High -> Low and Low -> High
const sortTodosByPriority = (): void => {
    const priorityWeights: Record<Priority, number> = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    // Flipping the switch
    isSortAscending = !isSortAscending;

    // Sorting the todos array based on the current sort order
    todos.sort((a, b) => {
        const weightDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
        return isSortAscending ? -weightDiff : weightDiff;
    });

    // Updating button label
    if (sortPriorityBtn) {
        sortPriorityBtn.textContent = isSortAscending 
            ? 'Sort: Low → High' 
            : 'Sort: High → Low';
    }

    renderTodos();
};

// Render function
const renderTodos = (): void => {
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');

        // Highlight overdue todos (only if not yet completed)
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

        // Checkbox event listener
        const checkbox = li.querySelector('.toggle-check') as HTMLInputElement;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        // Remove button event listener
        const removeButton = li.querySelector('.remove-btn') as HTMLButtonElement;
        removeButton.addEventListener('click', () => removeTodo(todo.id));

        todoList.appendChild(li);
    });
};

// Form submit event and input validation
todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const text = todoInput.value.trim();

    // Option 16: Handle Errors with visual input validation
    if (text === '') {
        if (errorMessage) errorMessage.style.display = 'block';
        todoInput.style.borderColor = '#f85149';
        return;
    }

    // Reset error feedback on successful submission
    if (errorMessage) errorMessage.style.display = 'none';
    todoInput.style.borderColor = '';

    const priority = prioritySelect.value as Priority;
    const dueDate = dueDateInput.value;

    addTodo(text, priority, dueDate);

    // Reset input fields
    todoInput.value = '';
    dueDateInput.value = '';
});

// Listener for sorting by priority
if (sortPriorityBtn) {
    sortPriorityBtn.addEventListener('click', sortTodosByPriority);
}

// Option 14: Clear local storage listener
if (clearStorageBtn) {
    clearStorageBtn.addEventListener('click', clearAllStorage);
}

// Initial render to load stored items on boot
renderTodos();