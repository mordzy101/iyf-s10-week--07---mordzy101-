/**
 * Interactive To-Do List
 *
 * Lesson 13:
 * - Save tasks with localStorage.
 * - Save temporary UI state with sessionStorage.
 * - Restore saved state when the page loads.
 *
 * Lesson 14:
 * - Keep state updates, storage, rendering, and events in focused helpers.
 * - Use constants for repeated values.
 * - Render user input with textContent instead of HTML strings.
 */

const STORAGE_KEYS = {
    tasks: 'todo.tasks',
    filter: 'todo.filter',
    draft: 'todo.draft'
};

const FILTERS = {
    all: 'all',
    active: 'active',
    completed: 'completed'
};

const state = {
    tasks: loadTasks(),
    currentFilter: normalizeFilter(loadSessionValue(STORAGE_KEYS.filter, FILTERS.all))
};

const elements = {
    taskInput: document.getElementById('taskInput'),
    taskForm: document.getElementById('taskForm'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskList: document.getElementById('taskList'),
    emptyState: document.getElementById('emptyState'),
    totalCount: document.getElementById('totalCount'),
    activeCount: document.getElementById('activeCount'),
    completedCount: document.getElementById('completedCount'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    clearCompletedBtn: document.getElementById('clearCompletedBtn')
};

init();

function init() {
    restoreDraft();
    bindEvents();
    syncFilterButtons();
    updateAddButtonState();
    render();
    elements.taskInput.focus();
}

function bindEvents() {
    elements.taskForm.addEventListener('submit', handleTaskSubmit);
    elements.taskInput.addEventListener('input', handleDraftInput);
    elements.taskInput.addEventListener('keydown', handleInputKeydown);
    elements.taskList.addEventListener('click', handleTaskListClick);
    elements.clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    elements.filterBtns.forEach(button => {
        button.addEventListener('click', () => setFilter(button.dataset.filter));
    });
}

function handleTaskSubmit(event) {
    event.preventDefault();
    addTask(elements.taskInput.value);
}

function handleDraftInput() {
    sessionStorage.setItem(STORAGE_KEYS.draft, elements.taskInput.value);
    updateAddButtonState();
}

function handleInputKeydown(event) {
    if (event.key !== 'Escape') {
        return;
    }

    elements.taskInput.value = '';
    sessionStorage.removeItem(STORAGE_KEYS.draft);
    updateAddButtonState();
}

function handleTaskListClick(event) {
    const taskItem = event.target.closest('.task-item');

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.taskId);

    if (event.target.matches('.checkbox, .task-text')) {
        toggleTask(taskId);
        return;
    }

    if (event.target.matches('.delete-btn')) {
        deleteTask(taskId);
    }
}

function addTask(text) {
    const trimmedText = text.trim();

    if (!trimmedText) {
        return;
    }

    state.tasks.push({
        id: createTaskId(),
        text: trimmedText,
        completed: false,
        createdAt: new Date().toISOString()
    });

    elements.taskInput.value = '';
    sessionStorage.removeItem(STORAGE_KEYS.draft);
    updateAddButtonState();
    saveAndRender();
    elements.taskInput.focus();
}

function toggleTask(taskId) {
    const task = state.tasks.find(item => item.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;
    saveAndRender();
}

function deleteTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    saveAndRender();
}

function clearCompletedTasks() {
    state.tasks = state.tasks.filter(task => !task.completed);
    saveAndRender();
}

function setFilter(filter) {
    if (!Object.values(FILTERS).includes(filter)) {
        return;
    }

    state.currentFilter = filter;
    sessionStorage.setItem(STORAGE_KEYS.filter, filter);
    syncFilterButtons();
    render();
}

function saveAndRender() {
    saveTasks();
    render();
}

function render() {
    const filteredTasks = getFilteredTasks();

    elements.taskList.replaceChildren(...filteredTasks.map(createTaskElement));
    updateStats();
    updateEmptyState(filteredTasks.length);
    updateClearCompletedButton();
}

function createTaskElement(task) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('button');
    const taskText = document.createElement('span');
    const deleteButton = document.createElement('button');

    listItem.className = task.completed ? 'task-item completed' : 'task-item';
    listItem.dataset.taskId = String(task.id);

    checkbox.className = 'checkbox';
    checkbox.type = 'button';
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', String(task.completed));
    checkbox.setAttribute('aria-label', getToggleLabel(task));

    taskText.className = 'task-text';
    taskText.textContent = task.text;

    deleteButton.className = 'delete-btn';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.textContent = 'x';

    listItem.append(checkbox, taskText, deleteButton);

    return listItem;
}

function getFilteredTasks() {
    if (state.currentFilter === FILTERS.active) {
        return state.tasks.filter(task => !task.completed);
    }

    if (state.currentFilter === FILTERS.completed) {
        return state.tasks.filter(task => task.completed);
    }

    return state.tasks;
}

function updateStats() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.completed).length;
    const active = total - completed;

    elements.totalCount.textContent = total;
    elements.activeCount.textContent = active;
    elements.completedCount.textContent = completed;
}

function updateEmptyState(visibleTaskCount) {
    const hasTasks = state.tasks.length > 0;
    const message = hasTasks
        ? `No ${state.currentFilter} tasks to show.`
        : 'No tasks yet. Add one to get started!';

    elements.emptyState.querySelector('p').textContent = message;
    elements.emptyState.classList.toggle('show', visibleTaskCount === 0);
}

function updateClearCompletedButton() {
    elements.clearCompletedBtn.disabled = !state.tasks.some(task => task.completed);
}

function updateAddButtonState() {
    elements.addTaskBtn.disabled = elements.taskInput.value.trim().length === 0;
}

function syncFilterButtons() {
    elements.filterBtns.forEach(button => {
        const isActive = button.dataset.filter === state.currentFilter;

        button.classList.toggle('filter-btn-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

function restoreDraft() {
    elements.taskInput.value = loadSessionValue(STORAGE_KEYS.draft, '');
}

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks)) || [];

        if (!Array.isArray(savedTasks)) {
            return [];
        }

        return savedTasks
            .filter(isValidTask)
            .map(task => ({
                id: Number(task.id),
                text: task.text.trim(),
                completed: Boolean(task.completed),
                createdAt: task.createdAt || new Date().toISOString()
            }));
    } catch (error) {
        console.warn('Saved tasks could not be loaded. Starting with an empty list.', error);
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(state.tasks));
}

function loadSessionValue(key, fallback) {
    return sessionStorage.getItem(key) || fallback;
}

function normalizeFilter(filter) {
    return Object.values(FILTERS).includes(filter) ? filter : FILTERS.all;
}

function createTaskId() {
    return state.tasks.reduce((highestId, task) => Math.max(highestId, task.id), 0) + 1;
}

function isValidTask(task) {
    return (
        task &&
        Number.isFinite(Number(task.id)) &&
        typeof task.text === 'string' &&
        task.text.trim().length > 0
    );
}

function getToggleLabel(task) {
    return task.completed ? `Mark ${task.text} as active` : `Mark ${task.text} as completed`;
}
