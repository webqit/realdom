
/**
 * @imports
 */
import _each from '../obj/each.js';

/**
 * Converts words to numbers
 * Adapted from Crunz\Utils | 22-07-17;
 *
 * @param  text
 *
 * @return string
 */
export default function(text) {
	var data = strtr(text, {
		zero:       '0',
		a:          '1',
		one:        '1',
		two:        '2',
		three:      '3',
		four:       '4',
		five:       '5',
		six:        '6',
		seven:      '7',
		eight:      '8',
		nine:       '9',
		ten:        '10',
		eleven:     '11',
		twelve:     '12',
		thirteen:   '13',
		fourteen:   '14',
		fifteen:    '15',
		sixteen:    '16',
		seventeen: 	'17',
		eighteen:   '18',
		nineteen:   '19',
		twenty:     '20',
		thirty:     '30',
		forty:      '40',
		fourty:     '40',
		fifty:      '50',
		sixty:      '60',
		seventy:    '70',
		eighty:     '80',
		ninety:     '90',
		hundred:    '100',
		thousand:   '1000',
		million:    '1000000',
		billion:    '1000000000',
		and:        '',
	});

	// Coerce all tokens to numbers
	var parts = data.split('/[\s-]+/').map(val => parseFloat(val));

	var tmp   = null;
	var sum   = 0;
	var last  = null;

	_each(parts, (i, part) => {           
		if (tmp !== '') {                
			if (tmp > part) {
				if (last >= 1000) {                                       
					sum += tmp;
					tmp = part;
				} else {          
					tmp = tmp + part;
				}
			} else {
				tmp = tmp * part;
			}
		} else {
			tmp = part;
		}
		
		last = part;
	});

	return sum + tmp;    
};
