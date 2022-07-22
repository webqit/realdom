
/**
 * Returns the index of subset array "b" in array "a".
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * @param {Bool} last
 * 
 * @returns Int
 */
export default function indexOfSet(a, b, fromInex = null, last = false) {
    if (b.length > a.length) return -1;
	return (typeof fromInex === 'number' ? (last ? a.slice(0, (fromInex + 1) + (fromInex < 0 ? a.length : 0)) : a.slice(fromInex)) : a).reduce((cursors, value, i) => {
        var [ index, cursorA, cursorB ] = cursors;
        if (!last && index > -1) {
            return [index, cursorA, cursorB];
        }
        var _cursorB = cursorB + 1;
        var _cursors = value === b[_cursorB] ? (_cursorB === 0 ? [i, 0] : [cursorA, _cursorB]) : [-1, -1];
        if (_cursors[1] === b.length - 1) {
            // Reset B cursor
            _cursors[1] = -1;
            if (_cursors[0] > -1) {
                return [_cursors[0]].concat(_cursors);
            }
        }
        return [index].concat(_cursors);
    }, [-1, -1, -1])[0] + (last || typeof fromInex !== 'number' ? 0 : (fromInex > -1 ? fromInex : a.length - fromInex));
}