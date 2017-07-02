
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