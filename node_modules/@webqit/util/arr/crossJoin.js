
/**
 * @imports
 */
import _arrFrom from './from.js';

/**
 * Accepts an array where each entry is a segment of a path
 * (where each segment may be a compound segment (multiple possible values)),
 * returns an array of paths with compound segments exploded.
 * 
 * ['a', 'b', 'c'] 					=> 	[ ['a', 'b', 'c'] ]
 * [ ['a'], 'b', ['c1', 'c2'] ] 	=> 	[
 * 											['a', 'b', 'c1']
 * 											['a', 'b', 'c2']
 * 										]
 * [ ['a'], 'b', ['c1', 'c2', 'c3] ]=> 	[
 * 											['a', 'b', 'c1']
 * 											['a', 'b', 'c2']
 * 											['a', 'b', 'c3']
 * 										]
 *
 * @param array 	arr
 *
 * @return number
 */
export default function(arr) {
	return arr.reduce((currTable, column) => {
		var newTable = [];
		currTable.forEach(row => {
			_arrFrom(column).forEach(column => {
				var _row = row.slice();
				_row.push(column);
				newTable.push(_row);
			});
		});
		return newTable;
	}, [[]]);
};