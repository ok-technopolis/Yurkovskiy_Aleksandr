/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function Eventable() {}

const eventablePrototype = Eventable.prototype;

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
    const subscribers = getEventSubscribers(this, eventName, true);

    subscribers.push({
        handler: handler,
        ctx: ctx
    });

    return this;
};

eventablePrototype.off = function (eventName, handler, ctx) {
    const subscribers = getEventSubscribers(this, eventName);

    if (subscribers) {
        for (let i = subscribers.length; i-- ;) {
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
    const subscribers = getEventSubscribers(this, eventName);

    if (subscribers) {
        const subscribersCopy = subscribers.slice();
        for (var i = 0, l = subscribersCopy.length; i !== l; i += 1) {
            subscribersCopy[i].handler.call(subscribersCopy[i].ctx, data);
        }
    }

    return this;
};

module.exports = Eventable;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * @param {Function} Extendable
 * @param {Function} Extension
 * @return {Function} Extendable
 */
function extendConstructor(Extendable, Extension) {
    const extendablePrototype = Extendable.prototype;
    const extensionPrototype = Extension.prototype;

    for (const p in extensionPrototype) {
        extendablePrototype[p] = extensionPrototype[p];
    }

    return Extendable;
}

module.exports = extendConstructor;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * @return {number}
 */
function EAST_SLAVIC_ALGORITHM(number) {
    const value = Math.abs(number);

    if ((value % 10 === 1) && (value % 100 !== 11)) {
        return 0;
    }
    if ((2 <= (value % 10))
        && ((value % 10) <= 4)
        && (Math.floor((value % 100) / 10) !== 1)
    ) {
        return 1;
    }

    return 2;
}

/**
 * @return {number}
 */
function ROMANO_GERMANIC_ALGORITHM(number) {
    return (Math.abs(number) === 1) ? 0 : 1;
}

const pluralAlgorithms = {
    'ru': EAST_SLAVIC_ALGORITHM,
    'en': ROMANO_GERMANIC_ALGORITHM
};

const l10n = {
    language: 'ru',
    _dictionaries: {},

    /**
     * @param {String} key
     * @return {String}
     * @private
     */
    _getDictValue: function (key) {
        const language = this.language;

        if (!(language in this._dictionaries)
            || !(key in this._dictionaries[language])
        ) {
            return null;
        }

        return this._dictionaries[language][key];
    },

    /**
     * @param {String} languageCode
     * @param {Object} dict
     * @return {l10n}
     */
    provideDict: function (languageCode, dict) {
        this._dictionaries[languageCode] = dict;
        return this;
    },

    /**
     * @param {String} key
     * @return {String}
     */
    simple: function (key) {
        const dictValue = this._getDictValue(key);
        if (dictValue !== null) {
            return dictValue;
        }
        return key;
    },

    /**
     * @param {String} key
     * @param {Number} number
     * @return {String}
     */
    plural: function (key, number) {
        const dictValue = this._getDictValue(key);
        if (dictValue === null) {
            return key;
        }

        const currentPluralAlgorithm = pluralAlgorithms[this.language] || pluralAlgorithms.ru;
        const result = dictValue[currentPluralAlgorithm(number)];

        if (result !== null) {
            return result;
        }
        return key;

    }
};

module.exports = l10n;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const extendConstructor = __webpack_require__(1);
const Eventable = __webpack_require__(0);

const ENTER_KEY_CODE = 13;

const TODOS_TODO_INPUT_SELECTOR = '.js-todos-todo-input';
const TODOS_SELECT_ALL_SELECTOR = '.js-todos-select-all';


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

const addTodosConstructorPrototype = AddTodosConstructor.prototype;

addTodosConstructorPrototype._markAsReadyAll = function () {
    return this.trigger('markAsReadyAll');
};

addTodosConstructorPrototype._addItem = function () {
    const todoInputValue = this._todoInput.value.trim();

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

module.exports = AddTodosConstructor;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const extendConstructor = __webpack_require__(1);
const getTextNode = __webpack_require__(11);
const Eventable = __webpack_require__(0);
const l10n = __webpack_require__(2);
const Filter = __webpack_require__(7);

/**
 * @constructor
 * @implements {EventListener}
 */
function TodoActionsBarConstructor() {
    this._initEventable();

    this._counterNode = document.querySelector('.js-todos-actions-bar_counter');
    this._counterNodeText = getTextNode(this._counterNode);
    this._clearCompletedNode = document.querySelector('.js-todos-actions-bar_clear-completed');

    this._clearCompletedNode.addEventListener('click', this);

    this._filters = new Filter(document.querySelector('.js-todos-actions-bar_filter'));

    this._filters.on('filterSelected', this._onFilterSelected, this);
}

extendConstructor(TodoActionsBarConstructor, Eventable);

const todoActionsBarConstructorPrototype = TodoActionsBarConstructor.prototype;

todoActionsBarConstructorPrototype._onFilterSelected = function (filterId) {
    this.trigger('filterSelected', filterId);
};

/**
 * @return {TodoActionsBarConstructor}
 * @private
 */
todoActionsBarConstructorPrototype._clearCompleted = function () {
    this.trigger('clearCompleted');
    return this;
};

/**
 * @param {Number} count
 * @return {TodoActionsBarConstructor}
 */
todoActionsBarConstructorPrototype.setItemsCount = function (count) {
    this._counterNodeText.nodeValue = count + ' ' + l10n.plural('todosCountLabel', count);
    return this;
};

/**
 * @param {Event} e
 */
todoActionsBarConstructorPrototype.handleEvent = function (e) {
    switch (e.type) {
        case 'click':
            this._clearCompleted();
            break;
    }
};

module.exports = TodoActionsBarConstructor;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Eventable = __webpack_require__(0);
const extendConstructor = __webpack_require__(1);

const TodoItem = __webpack_require__(8);

const TODO_LIST_SELECTOR = '.js-todos-list';
let itemsIdIterator = 0;

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
    this._currentFilter = 'all';

    this._initEventable();
}

extendConstructor(TodoListConstructor, Eventable);

const todoListConstructorPrototype = TodoListConstructor.prototype;

/**
 * @return {Number}
 */
todoListConstructorPrototype.getItemsCount =function () {
    return this._items.length;
};

/**
 * @param {Object} todoItemData
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.createItem = function (todoItemData) {
    const item = new TodoItem(Object.assign(
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

/**
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.removeCompletedItems = function () {
    const items = this._items;
    let i = items.length;

    for (; i-- ;) {
        if (items[i].model.isReady) {
            items[i].remove();
        }
    }

    return this;
};

/**
 * @param {Number} itemId
 * @return {TodoItemConstructor}
 * @private
 */
todoListConstructorPrototype._getItemById = function (itemId) {
    const items = this._items;

    for (let i = items.length; i-- ;) {
        if (items[i].model.id === itemId) {
            return items[i];
        }
    }

    return null;
};

todoListConstructorPrototype._onItemChange = function (itemModel) {
    this.filterShowedItems(this._currentFilter);
};

todoListConstructorPrototype._onItemRemove = function (itemId) {
    const todoItemComponent = this._getItemById(itemId);

    if (todoItemComponent) {
        todoItemComponent.off('change', this._onItemChange, this);
        todoItemComponent.off('remove', this._onItemRemove, this);
        const todoItemComponentIndex = this._items.indexOf(todoItemComponent);
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

/**
 * @param {String} filterId
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.setFilter = function (filterId) {
    this._currentFilter = filterId;
    return this.filterShowedItems(filterId);
};

/**
 * @param {String} filterId
 * @return {TodoListConstructor}
 */
todoListConstructorPrototype.filterShowedItems = function (filterId) {
    this._items.forEach(function (item) {
        switch (filterId) {
            case 'all':
                item.show();
                break;
            case 'ready':
                if (item.model.isReady) {
                    item.show();
                } else {
                    item.hide();
                }
                break;
            case 'unready':
                if (!item.model.isReady) {
                    item.show();
                } else {
                    item.hide();
                }
                break;
        }
    });
    return this;
};

module.exports = TodoListConstructor;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

const TODOS_MAIN_SELECTOR = '.js-todos-main';
const FULL_INTERFACE_MODIFICATOR = '__has-todos';

function TodoMainConstructor() {
    this._todosMain = document.querySelector(TODOS_MAIN_SELECTOR);
}

const todoMainComponentConstructorPrototype = TodoMainConstructor.prototype;

todoMainComponentConstructorPrototype.showFullInterface = function () {
    this._todosMain.classList.add(FULL_INTERFACE_MODIFICATOR);
    return this;
};

todoMainComponentConstructorPrototype.hideFullInterface = function () {
    this._todosMain.classList.remove(FULL_INTERFACE_MODIFICATOR);
    return this;
};

module.exports = TodoMainConstructor;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Eventable = __webpack_require__(0);
const extendConstructor = __webpack_require__(1);

const ACTIVE_FILTER_MODIFICATOR = '__active';

/**
 * @param {HTMLElement} domRoot
 * @constructor
 * @implements {EventListener}
 */
function FilterConstructor(domRoot) {
    this._initEventable();

    const filters = this._filters = domRoot.querySelectorAll('.filter');
    this._currentActive = null;

    for (let i = filters.length; i-- ;) {
        filters[i].addEventListener('click', this);
        if (filters[i].classList.contains(ACTIVE_FILTER_MODIFICATOR)) {
            this._currentActive = filters[i];
        }
    }
}

extendConstructor(FilterConstructor, Eventable);

const filterConstructorPrototype = FilterConstructor.prototype;

/**
 * @param {HTMLElement} filterElement
 * @return {FilterConstructor}
 * @private
 */
filterConstructorPrototype._setFilter = function (filterElement) {
    if (this._currentActive !== filterElement) {
        this._currentActive.classList.remove(ACTIVE_FILTER_MODIFICATOR);
        filterElement.classList.add(ACTIVE_FILTER_MODIFICATOR);
        this._currentActive = filterElement;
        this.trigger('filterSelected', filterElement.getAttribute('data-filter'));
    }
    return this;
};

filterConstructorPrototype.handleEvent = function (e) {
    switch (e.type) {
        case 'click':
            this._setFilter(e.target);
            break;
    }
};

module.exports = FilterConstructor;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Eventable = __webpack_require__(0);
const extendConstructor = __webpack_require__(1);
const templatesEngine = __webpack_require__(10);

const READY_MODIFICATOR = '__ready';
const HIDDEN_MODIFICATOR = '__hide';

const ENTER_KEY_CODE = 13;

/**
 * @param itemData
 * @implements {EventListener}
 * @constructor
 */
function TodoItemConstructor(itemData) {
    this._initEventable();

    const templateResult = templatesEngine.todoItem({
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
    this._text.addEventListener('keypress', this)
}

extendConstructor(TodoItemConstructor, Eventable);

const todoItemConstructorPrototype = TodoItemConstructor.prototype;

/**
 * @param {HTMLElement} parent
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.render = function (parent) {
    parent.appendChild(this._root);
    return this;
};

/**
 * @param {Event} e
 */
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
        case 'keypress':
            if (e.keyCode === ENTER_KEY_CODE) {
                const text = this._text.innerText.trim();
                if(text.length === 0){
                    this.remove();
                }
            }

            break;
    }
};

/**
 * @param {String} text
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.setText = function (text) {
    if (this.model.text !== text) {
        this._text.innerHTML = text;
        this.model.text = text;
        this.trigger('change', this.model);
    }
    return this;
};

/**
 * @param {Boolean} isReady
 * @return {TodoItemConstructor}
 * @private
 */
todoItemConstructorPrototype._setReadyModificator = function (isReady) {
    if (isReady) {
        this._root.classList.add(READY_MODIFICATOR);
    } else {
        this._root.classList.remove(READY_MODIFICATOR);
    }
    return this;
};

/**
 * @param {Boolean} isReady
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.setReady = function (isReady) {
    if (isReady !== this.model.isReady) {
        this._markReady.checked = isReady;
        this.model.isReady = isReady;
        this._setReadyModificator(isReady);
        this.trigger('change', this.model);
    }
    return this;
};

/**
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.remove = function () {
    this._root.parentNode.removeChild(this._root);
    this.trigger('remove', this.model.id);
    return this;
};

/**
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.show = function () {
    this._root.classList.remove(HIDDEN_MODIFICATOR);
    return this;
};

/**
 * @return {TodoItemConstructor}
 */
todoItemConstructorPrototype.hide = function () {
    this._root.classList.add(HIDDEN_MODIFICATOR);
    return this;
};

module.exports = TodoItemConstructor;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const l10n = __webpack_require__(2);

const TodoMain = __webpack_require__(6);
const AddTodos = __webpack_require__(3);
const TodoList = __webpack_require__(5);
const TodoActionsBar = __webpack_require__(4);

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

/***/ }),
/* 10 */
/***/ (function(module, exports) {


const div = document.createElement('div');

function getTemplateRootNode(scriptId) {
    const scriptTag = document.getElementById(scriptId);
    div.innerHTML = scriptTag.innerHTML;
    const result = div.children[0];
    div.removeChild(result);
    return result;
}

const templatesEngine = {
    todoItem: function (data) {
        const root = getTemplateRootNode('todoItemTemplate');

        const markReady = root.querySelector('.js-todo-item_mark-ready');
        const removeAction = root.querySelector('.js-todo-item_remove-action');
        const text = root.querySelector('.js-todo-item_text');

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
};

module.exports = templatesEngine;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * @param {HTMLElement} node
 * @return {Node}
 */
function getTextNode(node) {
    const childs = node.childNodes;
    let i = 0;
    const l = childs.length;

    for (; i !== l; i += 1) {
        if (childs[i].nodeName === '#text') {
            return childs[i];
        }
    }

    const result = document.createTextNode('');
    node.appendChild(result);
    return result;
}

module.exports = getTextNode;

/***/ })
/******/ ]);