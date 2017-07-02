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