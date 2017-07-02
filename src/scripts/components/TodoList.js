const Eventable = require('../modules/Eventable');
const extendConstructor = require('../utils/extendConstructor');

const TodoItem = require('../components/TodoItem');

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