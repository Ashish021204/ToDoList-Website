// js/app.js
// To-Do List App — Vanilla JavaScript
// Features: add, toggle complete, delete, clear completed/all, persist to localStorage
// Uses event delegation for list actions. ES6-style, commented and modular.

const selectors = {
  form: document.getElementById('task-form'),
  input: document.getElementById('task-input'),
  list: document.getElementById('task-list'),
  counter: document.getElementById('counter'),
  clearCompleted: document.getElementById('clear-completed'),
  clearAll: document.getElementById('clear-all')
};

const STORAGE_KEY = 'todo_app_tasks';

/* Utility: read tasks from localStorage */
const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load tasks', e);
    return [];
  }
};

/* Utility: save tasks to localStorage */
const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

/* Render helpers */
const createTaskElement = (task) => {
  // task = { id, text, completed }
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-left">
      <label class="checkbox" title="Toggle complete">
        <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task complete">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path fill="currentColor" d="M20.285 6.708L9 18 3.714 12.707l1.571-1.571L9 14.858l9.714-9.714z"></path>
        </svg>
      </label>
      <div class="task-text" title="${escapeHtml(task.text)}">${escapeHtml(task.text)}</div>
    </div>

    <div class="task-actions" aria-hidden="false">
      <button class="icon-btn btn-delete" title="Delete task" aria-label="Delete task">
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3h6l1 2h5v2H3V5h5l1-2zM6 8h12l-1 12H7L6 8z"/></svg>
      </button>
    </div>
  `;
  return li;
};

/* Escape HTML for safety (simple) */
const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

/* Re-render entire list from tasks array */
const renderTasks = (tasks) => {
  selectors.list.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'No tasks yet — add your first task!';
    selectors.list.appendChild(empty);
  } else {
    const frag = document.createDocumentFragment();
    tasks.forEach(task => {
      frag.appendChild(createTaskElement(task));
    });
    selectors.list.appendChild(frag);
  }
  updateCounter(tasks);
};

/* Update counter text */
const updateCounter = (tasks) => {
  const total = tasks.length;
  const remaining = tasks.filter(t => !t.completed).length;
  selectors.counter.textContent = `${remaining} active / ${total} total`;
};

/* Create a new task object */
const newTask = (text) => ({
  id: String(Date.now()) + Math.random().toString(36).slice(2,6),
  text: text.trim(),
  completed: false
});

/* Load initial tasks and render */
let tasks = loadTasks();
renderTasks(tasks);

/* Add task handler */
const addTaskFromInput = (text) => {
  const trimmed = String(text || '').trim();
  if (!trimmed) return false;
  const task = newTask(trimmed);
  tasks.unshift(task); // add to top
  saveTasks(tasks);
  renderTasks(tasks);
  return true;
};

/* Form submit (Add button or Enter) */
selectors.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = selectors.input.value;
  const added = addTaskFromInput(value);
  if (added) {
    selectors.input.value = '';
    selectors.input.focus();
  }
});

/* Event delegation on list: toggle complete and delete */
selectors.list.addEventListener('click', (e) => {
  const li = e.target.closest('.task-item');
  if (!li) return;

  const id = li.dataset.id;
  // If checkbox or its child clicked
  if (e.target.closest('.checkbox')) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(tasks);
    renderTasks(tasks);
    return;
  }

  // Delete button
  if (e.target.closest('.btn-delete')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks(tasks);
    return;
  }
});

/* Keyboard support: toggle with Space when focus on checkbox (native input handles it) */
/* Clear completed */
selectors.clearCompleted.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks(tasks);
  renderTasks(tasks);
});

/* Clear all */
selectors.clearAll.addEventListener('click', () => {
  if (!confirm('Clear all tasks? This cannot be undone.')) return;
  tasks = [];
  saveTasks(tasks);
  renderTasks(tasks);
});

/* Allow adding task by pressing Enter in the input (native form submit handles it)
   Add an accessibility improvement: prevent accidental whitespace-only tasks on blur */
selectors.input.addEventListener('blur', () => {
  selectors.input.value = selectors.input.value.trimStart();
});

/* Optional: allow double-click on text to edit (lightweight) */
selectors.list.addEventListener('dblclick', (e) => {
  const targetText = e.target.closest('.task-text');
  if (!targetText) return;
  const li = targetText.closest('.task-item');
  const id = li.dataset.id;
  const current = tasks.find(t => t.id === id);
  if (!current) return;

  // Replace text element with input
  const input = document.createElement('input');
  input.type = 'text';
  input.value = current.text;
  input.className = 'edit-input';
  input.style.width = '100%';
  targetText.replaceWith(input);
  input.focus();

  const finish = () => {
    const newVal = input.value.trim();
    if (newVal) {
      tasks = tasks.map(t => t.id === id ? { ...t, text: newVal } : t);
      saveTasks(tasks);
    }
    renderTasks(tasks);
  };

  input.addEventListener('blur', finish, { once: true });
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    } else if (ev.key === 'Escape') {
      renderTasks(tasks);
    }
  });
});
