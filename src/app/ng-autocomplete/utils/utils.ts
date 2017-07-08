import {AutocompleteItem} from "../classes/AutocompleteItem";
/**
 *
 * @param array
 * @returns {Array}
 * @constructor
 */
export function ReturnStringArrayByID(array: { id: string, [value: string]: any }[]) {
    return array.reduce((result, item) => {
        result.push(item.id);

        return result
    }, [])
}

/**
 *
 * @param removals
 * @param list
 * @returns {Array}
 * @constructor
 */
export function FilterRemovals(removals: string[], list: AutocompleteItem[]) {
    return list.filter((item) => {
        return removals.indexOf(item.id) <= -1;
    });
}