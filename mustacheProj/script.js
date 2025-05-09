async function loadTodos() {
    const res = await fetch('/todos');
    const todos = await res.json();
    const list = document.getElementById('todo-list');
    list.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${todo.id}, this)">
            ${todo.task}
            <span class="delete" onclick="deleteItem(${todo.id})">X</span>
        `;
        list.appendChild(li);
    });
}

async function addItem() {
    const input = document.getElementById('new-item');
    const text = input.value.trim();
    if (!text) return;

    await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: text })
    });

    input.value = '';
    loadTodos();
}

async function deleteItem(id) {
    await fetch(`/todos/${id}`, { method: 'DELETE' });
    loadTodos();
}

async function toggleComplete(id, checkbox) {
    await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: checkbox.checked })
    });
    loadTodos();
}

loadTodos();
