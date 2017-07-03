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