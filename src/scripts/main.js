const l10n = require('./modules/l10n');

const TodoMain = require('./components/TodoMain');
const AddTodos = require('./components/AddTodos');
const TodoList = require('./components/TodoList');
const TodoActionsBar = require('./components/TodoActionsBar');

function init() {
    const rusDictionary = {
        'todosCountLabel': ['задача', 'задачи', 'задач']
    };
    l10n.provideDict('ru', rusDictionary);

    const todoMain = new TodoMain();
    const addTodos = new AddTodos();
    const todoList = new TodoList();
    const todoActionsBar = new TodoActionsBar();


    addTodos
        .on('newTodo',
            function (todoData) { todoList.createItem(todoData); }
        )
        .on('markAsReadyAll',
            function () { todoList.markAsReadyAll();}
        );

    function itemsCountWatcher () {
        const itemsCount = todoList.getItemsCount();

        if (itemsCount !== 0) {
            todoMain.showFullInterface();
        } else {
            todoMain.hideFullInterface();
        }

        todoActionsBar.setItemsCount(itemsCount);
    }

    todoList.on('itemAdd', itemsCountWatcher)
        .on('itemDelete', itemsCountWatcher);

    todoActionsBar.on(
        'clearCompleted',
        function () { todoList.removeCompletedItems(); }
    );

    todoActionsBar.on('filterSelected', function (filterId) {
        todoList.setFilter(filterId);
    });

}

document.addEventListener('DOMContentLoaded', init);