# Week 7: Persistent To-Do List

## Author
- **Name:** Mordecai Shaffie
- **GitHub:** [@mordzy101](https://github.com/mordzy101)
- **Date:** May 7, 2026

## Project Description
This project is a refactored interactive to-do list application built to practice DOM manipulation, browser storage, state persistence, and readable JavaScript structure. Users can add tasks, complete tasks, delete tasks, filter the list, clear completed tasks, and keep saved tasks after refreshing or reopening the browser.

## Technologies Used
- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- Browser `localStorage`
- Browser `sessionStorage`

## Features
- Add new tasks using a form
- Mark tasks as active or completed
- Delete individual tasks
- Filter tasks by all, active, or completed
- Clear all completed tasks
- Display total, active, and completed task counts
- Save tasks with `localStorage`
- Restore saved tasks when the app loads
- Save the selected filter and draft input with `sessionStorage`
- Use a refactored, review-ready JavaScript structure

## How to Run
1. Clone this repository:
   ```bash
   git clone https://github.com/mordzy101/iyf-s10-week--07---mordzy101-.git
   ```
2. Open the project folder.
3. Open `index.html` in your browser.

## Lessons Learned
While building this project, I learned how to persist application state with `localStorage`, store temporary tab state with `sessionStorage`, and restore saved data when the page loads. I also practiced refactoring JavaScript into smaller functions for state updates, event handling, rendering, and storage.

This project completes the Lesson 13 exercises for localStorage, sessionStorage, and state persistence. It also completes the Lesson 14 exercises for code quality, refactoring, readable structure, and best-practice DOM patterns.

## Challenges Faced
One challenge was keeping the displayed task list synchronized with saved data after every add, complete, delete, clear, and filter action. I solved this by using one `state` object as the source of truth, saving changes to browser storage, and re-rendering the page from that state.

Another challenge was making the code easier to review. I solved this by separating constants, DOM references, event listeners, state actions, storage helpers, and rendering helpers.

## Screenshots (optional)
![Persistent To-Do List Screenshot](path/to/screenshot.png)

## Live Demo (if deployed)
[View Live Demo](https://your-deployed-url.com)
