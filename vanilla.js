document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const clearAllBtn = document.getElementById('clear-all-btn');

    addTaskBtn.addEventListener('click', addTask);
    clearAllBtn.addEventListener('click', clearAllTasks);
    taskList.addEventListener('click', handleTaskClick);
    taskList.addEventListener('blur', handleTaskEdit, true); 
    taskList.addEventListener('dragstart', handleDragStart);
    taskList.addEventListener('dragover', handleDragOver);
    taskList.addEventListener('drop', handleDrop);

    loadTasks();

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
    
        const li = createTaskElement(taskText);
        taskList.appendChild(li);
        taskInput.value = '';
    
        saveTasks();
    }

    function handleTaskClick(event) {
        const target = event.target;
        const li = target.closest('li');

        if (target.classList.contains('complete-btn')) {
            li.classList.toggle('completed');
            saveTasks();
        } else if (target.classList.contains('delete-btn')) {
            li.remove();
            saveTasks();
        } else if (target.tagName === 'SPAN') {
            target.setAttribute('contenteditable', true); 
            target.focus(); 
        }
    }

    function handleTaskEdit(event) {
        const target = event.target;
        if (target.tagName === 'SPAN') {
            const newTaskText = target.textContent.trim();
            target.setAttribute('contenteditable', false); 
            saveTasks();
        }
    }

    function handleDragStart(event) {
        event.target.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        const draggingElement = document.querySelector('.dragging');
        if (draggingElement) {
            const target = event.target.closest('li');
            const taskListItems = Array.from(taskList.children);

            const draggingIndex = taskListItems.indexOf(draggingElement);
            const targetIndex = taskListItems.indexOf(target);

            if (draggingIndex !== -1 && targetIndex !== -1) {
                if (draggingIndex < targetIndex) {
                    taskList.insertBefore(draggingElement, target.nextSibling);
                } else {
                    taskList.insertBefore(draggingElement, target);
                }
                saveTasks();
            }

            draggingElement.classList.remove('dragging');
        }
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
        localStorage.removeItem('tasks');
    }

    function saveTasks() {
        const tasks = Array.from(taskList.querySelectorAll('li span')).map(span => span.textContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(taskText => {
                const li = createTaskElement(taskText);
                taskList.appendChild(li);
            });
        }
    }

    function createTaskElement(taskText) {
        const li = document.createElement('li');
        li.draggable = true;
        li.innerHTML = `
            <span>${taskText}</span>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        return li;
    }
});
