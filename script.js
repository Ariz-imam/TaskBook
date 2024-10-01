// Select DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const tabButtons = document.querySelectorAll('.tab-button');

// Initialize tasks array
let tasks = [];

// Load tasks from localStorage
window.onload = function() {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        renderTasks();
    }
};

// Add Task Event
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        timestamp: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Save Tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Tasks Function
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('completed');
        li.setAttribute('data-id', task.id);

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', toggleTask);

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const timestamp = document.createElement('span');
        timestamp.className = 'task-timestamp';
        timestamp.textContent = task.timestamp;

        taskDetails.appendChild(checkbox);
        taskDetails.appendChild(span);
        taskDetails.appendChild(timestamp);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', deleteTask);

        li.appendChild(taskDetails);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

// Toggle Task Completion
function toggleTask(e) {
    const taskId = parseInt(e.target.closest('.task-item').getAttribute('data-id'));
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: e.target.checked };
        }
        return task;
    });
    saveTasks();
    renderTasks(getCurrentFilter());
}

// Delete Task Function
function deleteTask(e) {
    const taskId = parseInt(e.target.closest('.task-item').getAttribute('data-id'));
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    // Add fade out animation before removing
    const taskItem = e.target.closest('.task-item');
    taskItem.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        renderTasks(getCurrentFilter());
    }, 500);
}

// Tab Filtering
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.tab-button.active').classList.remove('active');
        button.classList.add('active');
        renderTasks(button.getAttribute('data-filter'));
    });
});

// Get Current Filter
function getCurrentFilter() {
    const activeTab = document.querySelector('.tab-button.active');
    return activeTab ? activeTab.getAttribute('data-filter') : 'all';
}
