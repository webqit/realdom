
/**
 * Instanceof that supports our multi-inheritance implementstion.
 *
 * @param object	 	obj1
 * @param object	 	classB
 *
 * @return bool
 */
export default function(obj, classB) {
	if (!obj) {
		return false;
	}
	if (obj instanceof classB) {
		return true;
	}
	var mixinTest = classA => {
		while (classA && classA !== Function.prototype) {
			if (classA === classB || (classA.prototypes && classA.prototypes.reduce((prevAns, prototype) => prevAns || (prototype === classB) || mixinTest(prototype), false))) {
				return true;
			}
			classA = Object.getPrototypeOf(classA);
		}
		return false;
	};
	return mixinTest(obj.constructor);
};
