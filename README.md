# ToDoList-Website
A simple and modern To-Do List application built with pure HTML, CSS, and Vanilla JavaScript. Features include adding tasks, marking them complete, editing tasks, deleting tasks, clearing lists, and storing everything in localStorage for persistence. Fully responsive with a clean UI and accessible controls.


<!-- README.md -->


## Features
- Add tasks (via Add button or pressing Enter)
- Mark tasks as completed (checkbox)
- Delete individual tasks
- Clear completed tasks and clear all tasks
- Persistent storage using `localStorage`
- Accessible controls, keyboard-friendly, and mobile-responsive
- Smooth micro-interactions and clear visual states

## Files
- `index.html` — main HTML file
- `css/style.css` — styles (mobile-first, responsive)
- `js/app.js` — application logic (DOM manipulation, event delegation)
- `README.md` — this file

## How to run
1. Clone or download the repo.
2. Open `index.html` in your browser **OR** use VS Code Live Server for local development:
   - Install *Live Server* extension, open the project folder, right-click `index.html` → *Open with Live Server*.
3. Start adding tasks!

## Notes for reviewers / interviewers
- Uses event delegation for efficient list handling.
- Tasks are stored in `localStorage` under the key `todo_app_tasks`.
- Code uses ES6 syntax (`const`, `let`, arrow functions, template strings).
- Minimal, framework-free implementation to demonstrate DOM skills.

## Possible improvements (ideas)
- Add sorting (by date, completed status)
- Add tags / priorities
- Add persistence to backend (API) for multi-device sync
- Add animations for add/remove with CSS transitions

---

**Accessibility checklist**
- Keyboard operable (Enter to add, native checkbox focus/space toggles)
- Visible focus outlines for interactive elements
- `aria-live` used for the task list counter
- Clear contrast and readable font sizes
