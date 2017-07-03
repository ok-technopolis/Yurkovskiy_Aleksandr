const Eventable = require('../modules/Eventable');
const extendConstructor = require('../utils/extendConstructor');
const templatesEngine = require('../modules/templatesEngine');

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
    this._text.addEventListener('keypress', this);
    this._text.addEventListener('blur', this);
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
                if(this._text.innerText.trim().length === 0){
                    this.remove();
                }
            }
            break;
        case 'blur':
            if(this._text.innerText.trim().length === 0){
                this.remove();
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