import './style.css'

//interface structure of the data schema
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let todos: Todo[] = [];

const todoInput = document.getElementById('todo-input') as HTMLInputElement
const todoForm = document.querySelector('.todo-form') as HTMLFormElement
const todoList = document.getElementById('todo-list') as HTMLUListElement

const errorMessage = document.getElementById('error-message') as HTMLParagraphElement



const addTodo = (text:string):void => {
    const newTodo: Todo = {
        id:Date.now(), //gguid
        text: text,
        completed: false
    }
    todos.push(newTodo)
    console.log(`Todo added: ${todos}`)

    renderTodos();
}

const renderTodos = ():void => {
    //clears the current list, so it doesnt rerender the previous ones again
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li')
        li.className = 'todo-item'
        li.innerHTML = `
        <span>${todo.text}</span>
        <button>Remove</button>
        `
        addRemoveButtonListener(li, todo.id);
        todoList.appendChild(li)
    })
}

renderTodos();

todoForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    const text = todoInput.value.trim()

    if (text !== '') {
        addTodo(text)
        todoInput.value = '' //clears the input field after add
    }
})


const addRemoveButtonListener = (li:HTMLLIElement, id:number):void => {
    const removeButton = li.querySelector('button');
    removeButton?.addEventListener('click', () => removeTodo(id)) //only exists when u have li, so you would get error otherwise
}

const removeTodo = (id:number):void => {
    todos = todos.filter(todo => todo.id !== id)
    renderTodos()
}