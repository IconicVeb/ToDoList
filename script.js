(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control', 'me-2');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.appendChild(input);
        form.append(buttonWrapper);
        return {
        form,
        input,
        button
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, isDone = false) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;
        item.dataset.taskName = name; // Добавляем атрибут данных с текстом задачи

        if (isDone) {
        item.classList.add('list-group-item-success');
        }

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Done';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Delete';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
        item,
        doneButton,
        deleteButton,
        isDone
        };
    }

    // Функция для сохранения задач в localStorage
    function saveTodoList(todoList) {
        if (todoList) {
        const todoListItems = Array.from(todoList.children).map(item => {
            return {
            text: item.dataset.taskName,
            isDone: item.classList.contains('list-group-item-success')
            };
        });
        localStorage.setItem('todoList', JSON.stringify(todoListItems));
        }
    }

    // Функция для восстановления задач из localStorage
    function restoreTodoList(todoList) {
        const savedData = localStorage.getItem('todoList');
        if (savedData) {
        const todoListItems = JSON.parse(savedData);
        todoListItems.forEach(itemData => {
            const todoItem = createTodoItem(itemData.text, itemData.isDone);
            todoList.append(todoItem.item);
            setupTodoItemEventListeners(todoItem);
        });
        }
    }

    function createTodoApp(container, title = 'Todo') {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        // Восстановление списка задач при загрузке страницы
        restoreTodoList(todoList);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        todoItemForm.form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!todoItemForm.input.value) {
            return;
        }

        let todoItem = createTodoItem(todoItemForm.input.value);
        todoList.append(todoItem.item);
        setupTodoItemEventListeners(todoItem);

        todoItemForm.input.value = '';

        // Сохранение обновленного списка задач
        saveTodoList(todoList);
        });
    }

    function setupTodoItemEventListeners(todoItem) {
        todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        todoItem.isDone = !todoItem.isDone; // Обновление состояния выполнения задачи
        // Сохранение обновленного списка задач
        saveTodoList(todoItem.item.parentNode);
        });

        todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены что хотите удалить?')) {
            todoItem.item.remove();
            // Удаление задачи из localStorage
            removeFromLocalStorage(todoItem.item.dataset.taskName);
        }
        });
    }

    // Функция для удаления задачи из localStorage
    function removeFromLocalStorage(itemText) {
        const savedData = localStorage.getItem('todoList');
        if (savedData) {
        const todoListItems = JSON.parse(savedData);
        const updatedList = todoListItems.filter(item => item.text !== itemText);
        localStorage.setItem('todoList', JSON.stringify(updatedList));
        }
    }

    window.createTodoApp = createTodoApp;
    })();

    document.addEventListener("DOMContentLoaded", function() {
    createTodoApp(document.getElementById("todo-app"), "To-Do");
    });