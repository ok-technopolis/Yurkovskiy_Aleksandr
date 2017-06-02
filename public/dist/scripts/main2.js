(function () {

    var ENTER_KEY_CODE = 13;

    var templatesEngine;

    (function () {
        var div = document.createElement('div');

        function getTemplateRootNode(scriptId) {
            var scriptTag = document.getElementById(scriptId);
            div.innerHTML = scriptTag.innerHTML;
            var result = div.children[0];
            div.removeChild(result);
            return result;
        }

        templatesEngine = {
            todoItem: function (data) {
                var root = getTemplateRootNode('todoItemTemplate');

                var markReady = root.querySelector('.js-todo-item_mark-ready');
                var removeAction = root.querySelector('.js-todo-item_remove-action');
                var text = root.querySelector('.js-todo-item_text');

                if (data.text) {
                    text.innerText = data.text;
                }

                if (data.isReady) {
                    markReady.checked = true;
                }

                return {
                    root: root,
                    text: text,
                    markReady: markReady,
                    removeAction: removeAction
                };
            }
        }
    }());




    /**
     * @param {Function} Extendable
     * @param {Function} Extension
     * @return {Function} Extendable
     */
    function extendConstructor(Extendable, Extension) {
        var extendablePrototype = Extendable.prototype;
        var extensionPrototype = Extension.prototype;

        for (var p in extensionPrototype) {
            extendablePrototype[p] = extensionPrototype[p];
        }

        return Extendable;
    }


    var Eventable;

    (function () {

        function EventableConstructor() {}

        var eventablePrototype = EventableConstructor.prototype;

        eventablePrototype._initEventable = function () {
            this._eventable_registry = {};
        };

        function getEventSubscribers(eventable, eventName, needCreate) {
            var registry = eventable._eventable_registry;

            if (eventName in registry) {
                return registry[eventName];

            } else if (needCreate) {
                return registry[eventName] = [];
            }

            return null;
        }

        eventablePrototype.on = function (eventName, handler, ctx) {
            var subscribers = getEventSubscribers(this, eventName, true);

            subscribers.push({
                handler: handler,
                ctx: ctx
            });

            return this;
        };

        eventablePrototype.off = function (eventName, handler, ctx) {
            var subscribers = getEventSubscribers(this, eventName);

            if (subscribers) {
                for (var i = subscribers.length; i-- ;) {
                    if ((subscribers[i].handler === handler)
                        && (subscribers[i].ctx === ctx)
                    ) {
                        subscribers.splice(i, 1);
                        return this;
                    }
                }
            }

            return this;
        };

        eventablePrototype.trigger = function (eventName, data) {
            var subscribers = getEventSubscribers(this, eventName);

            if (subscribers) {
                var subscribersCopy = subscribers.slice();
                for (var i = 0, l = subscribersCopy.length; i !== l; i += 1) {
                    subscribersCopy[i].handler.call(subscribersCopy[i].ctx, data);
                }
            }

            return this;
        };

        Eventable = EventableConstructor;

    }());


    var TodoMain;
    var AddTodos;
    var TodoList;
    var TodoItem;
    var TodoActionsBar;


    (function () {
        var TODOS_MAIN_SELECTOR = '.js-todos-main';
        var FULL_INTERFACE_MODIFICATOR = '__has-todos';

        function TodoMainConstructor() {
            this._todosMain = document.querySelector(TODOS_MAIN_SELECTOR);
        }

        var todoMainComponentConstructorPrototype = TodoMainConstructor.prototype;

        todoMainComponentConstructorPrototype.showFullInterface = function () {
            this._todosMain.classList.add(FULL_INTERFACE_MODIFICATOR);
            return this;
        };

        todoMainComponentConstructorPrototype.hideFullInterface = function () {
            this._todosMain.classList.remove(FULL_INTERFACE_MODIFICATOR);
            return this;
        };

        TodoMain = TodoMainConstructor;
    }());


    (function () {
        var TODOS_TODO_INPUT_SELECTOR = '.js-todos-todo-input';
        var TODOS_SELECT_ALL_SELECTOR = '.js-todos-select-all';

        /**
         * @implements {EventListener}
         * @extends {Eventable}
         * @constructor
         */
        function AddTodosConstructor() {
            this._todoInput = document.querySelector(TODOS_TODO_INPUT_SELECTOR);
            this._todoSelectAll = document.querySelector(TODOS_SELECT_ALL_SELECTOR);

            this._todoInput.addEventListener('keypress', this);
            this._todoSelectAll.addEventListener('click', this);

            this._initEventable();
        }

        extendConstructor(AddTodosConstructor, Eventable);

        var addTodosConstructorPrototype = AddTodosConstructor.prototype;

        addTodosConstructorPrototype._markAsReadyAll = function () {
            return this.trigger('markAsReadyAll');
        };

        addTodosConstructorPrototype._addItem = function () {
            var todoInputValue = this._todoInput.value.trim();

            if (todoInputValue.length !== 0) {
                this._todoInput.value = '';
            }

            return this.trigger('newTodo', {
                text: todoInputValue
            });
        };

        addTodosConstructorPrototype.handleEvent = function (e) {
            switch (e.type) {
                case 'click':
                    this._markAsReadyAll();
                    break;
                case 'keypress':
                    if (e.keyCode === ENTER_KEY_CODE) {
                        this._addItem();
                    }
                    break;
            }
        };

        AddTodos = AddTodosConstructor;
    }());


    (function () {
        var TODO_LIST_SELECTOR = '.js-todos-list';
        var itemsIdIterator = 0;

        /**
         * @extends {Eventable}
         * @constructor
         */
        function TodoListConstructor() {
            /**
             * @type {Array.<TodoItemConstructor>}
             * @private
             */
            this._items = [];
            this._todosList = document.querySelector(TODO_LIST_SELECTOR);

            this._initEventable();
        }

        extendConstructor(TodoListConstructor, Eventable);

        var todoListConstructorPrototype = TodoListConstructor.prototype;

        todoListConstructorPrototype.getItemsCount =function () {
            return this._items.length;
        };

        todoListConstructorPrototype.createItem = function (todoItemData) {
            var item = new TodoItem(Object.assign(
                {
                    id: itemsIdIterator++,
                },
                todoItemData
            ));

            this._items.push(item);

            item.on('change', this._onItemChange, this)
                .on('remove', this._onItemRemove, this)
                .render(this._todosList);

            this.trigger('itemAdd', item);

            return this;
        };

        todoListConstructorPrototype._getItemById = function (itemId) {
            var items = this._items;

            for (var i = items.length; i-- ;) {
                if (items[i].model.id === itemId) {
                    return items[i];
                }
            }

            return null;
        };

        todoListConstructorPrototype._onItemChange = function (itemModel) {

        };

        todoListConstructorPrototype._onItemRemove = function (itemId) {
            var todoItemComponent = this._getItemById(itemId);

            if (todoItemComponent) {
                todoItemComponent.off('change', this._onItemChange, this);
                todoItemComponent.off('remove', this._onItemRemove, this);
                var todoItemComponentIndex = this._items.indexOf(todoItemComponent);
                this._items.splice(todoItemComponentIndex, 1);
                this.trigger('itemDelete', todoItemComponent.model);
            }

            return this;
        };

        /**
         * @return {TodoListConstructor}
         */
        todoListConstructorPrototype.markAsReadyAll = function () {
            this._items.forEach(function (todoItem) {
                todoItem.setReady(true);
            });
            return this;
        };

        TodoList = TodoListConstructor;
    }());


    (function () {
        var READY_MODIFICATOR = '__ready';

        /**
         * @param itemData
         * @implements {EventListener}
         * @constructor
         */
        function TodoItemConstructor(itemData) {
            this._initEventable();

            var templateResult = templatesEngine.todoItem({
                text: itemData.text
            });

            this._root = templateResult.root;
            this._markReady = templateResult.markReady;
            this._removeAction = templateResult.removeAction;
            this._text = templateResult.text;

            this.model = {
                id: itemData.id,
                isReady: itemData.isReady || false,
                text: itemData.text
            };

            if (itemData.isReady) {
                this._setReadyModificator(true);
            }

            this._markReady.addEventListener('change', this);
            this._removeAction.addEventListener('click', this);
            this._text.addEventListener('input', this);
        }

        extendConstructor(TodoItemConstructor, Eventable);

        var todoItemConstructorPrototype = TodoItemConstructor.prototype;

        todoItemConstructorPrototype.render = function (root) {
            root.appendChild(this._root);
            return this;
        };

        todoItemConstructorPrototype.handleEvent = function (e) {
            switch (e.type) {
                case 'change':
                    this.setReady(this._markReady.checked);
                    break;
                case 'click':
                    if (e.target === this._removeAction) {
                        this.remove();
                    }
                    break;
                case 'input':
                    this.setText(this._text.innerText);
                    break;
            }
        };

        todoItemConstructorPrototype.setText = function (text) {
            if (this.model.text !== text) {
                this._text.innerHTML = text;
                this.model.text = text;
                this.trigger('change', this.model);
            }
            return this;
        };

        todoItemConstructorPrototype._setReadyModificator = function (isReady) {
            if (isReady) {
                this._root.classList.add(READY_MODIFICATOR);
            } else {
                this._root.classList.remove(READY_MODIFICATOR);
            }
        };

        todoItemConstructorPrototype.setReady = function (isReady) {
            if (isReady !== this.model.isReady) {
                this._markReady.checked = isReady;
                this.model.isReady = isReady;
                this._setReadyModificator(isReady);
                this.trigger('change', this.model);
            }
            return this;
        };

        todoItemConstructorPrototype.remove = function () {
            this._root.parentNode.removeChild(this._root);
            this.trigger('remove', this.model.id);
            return this;
        };

        TodoItem = TodoItemConstructor;
    }());


    (function () {
        function TodoActionsBarConstructor() {

        }

        TodoActionsBar = TodoActionsBarConstructor;
    }());


    function init() {
        var todoMain = new TodoMain();
        var addTodos = new AddTodos();
        var todoList = new TodoList();
        var todoActionsBar = new TodoActionsBar();


        addTodos.on('newTodo', function (todoData) {
            todoList.createItem(todoData);
        });

        addTodos.on('markAsReadyAll', function () {
            todoList.markAsReadyAll();
        });

        todoList.on('itemAdd', function (todoItemModel) {
            if (todoList.getItemsCount() !== 0) {
                todoMain.showFullInterface();
            }
        });

        todoList.on('itemDelete', function (todoItemModel) {
            if (todoList.getItemsCount() === 0) {
                todoMain.hideFullInterface();
            }
        });

        todoList.on('itemChange', function (todoItem) {

        });

    }

    document.addEventListener('DOMContentLoaded', init);
}());