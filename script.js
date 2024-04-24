document.addEventListener("DOMContentLoaded", function() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
        const taskList = document.getElementById("taskList");
        savedTasks.forEach(function(taskText) {
            addTaskElement(taskText, taskList);
        });
    }
});

function addTaskElement(taskText, parentElement) {
    const task = document.createElement("tr");
    const taskTextCell = document.createElement("td");
    taskTextCell.innerText = taskText;
    task.appendChild(taskTextCell);
    parentElement.appendChild(task);

    const actionsCell = document.createElement("td");
    actionsCell.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.innerText = "Изменить";
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Удалить";
    actionsCell.appendChild(deleteButton);

    const completeButton = document.createElement("button");
    completeButton.innerText = "Завершить";
    actionsCell.appendChild(completeButton);

    task.appendChild(actionsCell);

    deleteButton.addEventListener("click", function() {
        const confirmDelete = confirm("Вы уверены, что хотите удалить эту задачу?");
        if (confirmDelete) {
            task.remove();
            saveTasks();
        }
    });

    editButton.addEventListener("click", function() {
        const newTask = prompt("Изменить задачу", taskTextCell.innerText);
        if (newTask !== null && newTask !== "") {
            taskTextCell.innerText = newTask;
            saveTasks();
        }
    });

    completeButton.addEventListener("click", function() {
        taskTextCell.classList.toggle("completed");
        saveTasks();
    });

    task.addEventListener("dblclick", function() {
        this.remove();
        saveTasks();
    });
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");

    if (taskInput.value.trim() !== "") {
        addTaskElement(taskInput.value, taskList);
        taskInput.value = "";
        saveTasks();
    } else {
        alert("Пожалуйста, введите задачу!");
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        addTask();
    }
}

function saveTasks() {
    const tasks = [];
    const taskElements = document.querySelectorAll("#taskList td:first-child");
    taskElements.forEach(function(taskElement) {
        tasks.push(taskElement.innerText);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}