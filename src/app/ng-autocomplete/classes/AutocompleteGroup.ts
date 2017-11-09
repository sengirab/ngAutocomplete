import { AutocompleteItem, SearchableAutoCompleteItems } from './AutocompleteItem';

export class AutocompleteGroup {
    initialValue: { [value: string]: AutocompleteItem };

    key: string;
    keys: { titleKey: string, childrenKey: string | null };
    value: { [value: string]: AutocompleteItem };
    remove: string[];
    placeholder: string;
    parent: string;
    completion: boolean;

    private removals: string[] = [];
    private _copy: { [value: string]: AutocompleteItem };

    constructor() {

    }

    /**
     *
     * @param value
     * @param titleKey
     * @constructor
     */
    SetNewValue(value: { id: string | number; [value: string]: any }[], titleKey: string) {
        const values = SearchableAutoCompleteItems(value, titleKey);
        this.SetCopy(values);

        /**
         *
         * @type {AutocompleteItem[]}
         */
        this.value = this.FilterRemovals(this.removals, values);
    }

    /**
     *
     * @param ids
     * @constructor
     */
    Removables(ids: string[]) {
        this.removals = ids;

        /**
         *
         * @type {AutocompleteItem[]}
         */
        this.value = this.FilterRemovals(this.removals, this._copy);
    }

    /**
     *
     * @constructor
     */
    InitialValue() {
        this.value = this.FilterRemovals(this.removals, this.initialValue);

        /**
         *
         */
        this.SetCopy(this.initialValue);
    }

    /**
     *
     * @constructor
     */
    SetCopy(values: { [value: string]: AutocompleteItem }) {
        this._copy = Object.assign([], values);
    }

    /**
     *
     * @param value
     * @constructor
     */
    SetValues(value: { id?: string | number; [value: string]: any }[]) {
        this.value = SearchableAutoCompleteItems(value, this.keys.titleKey, this.keys.childrenKey);

        /**
         *
         */
        this.initialValue = Object.assign({}, this.value);
        this.SetCopy(Object.assign({}, this.value));
    }

    /**
     *
     * @param {any[]} removals
     * @param value
     * @constructor
     */
    FilterRemovals(removals: any[], value: { [value: string]: AutocompleteItem }): { [value: string]: AutocompleteItem } {
        let filtered = Object.assign({}, value);

        let key, keys = [];
        for (key in filtered) {
            if (filtered.hasOwnProperty(key)) {
                removals.forEach((id) => {
                    // Comparable string and ID
                    let f = `_id_${String(id)}`;
                    let c = key.substring(key.indexOf(f), key.length);

                    if (f === c) {
                        keys.push(key);
                    }
                })
            }
        }

        keys.forEach((k) => {
            delete filtered[k];
        });

        return filtered;
    }
}

/**
 *
 * @param {string} placeholder
 * @param {string} key
 * @param value
 * @param keys
 * @param {string} parent
 * @param {boolean} completion
 * @returns {AutocompleteGroup}
 * @constructor
 */
export function CreateNewAutocompleteGroup<T>(placeholder: string, key: string, value: { id?: string | number; [value: string]: any }[], keys: { titleKey: string, childrenKey: string | null }, parent: string = '', completion: boolean = true): AutocompleteGroup {
    const group = new AutocompleteGroup();

    group.key = key;
    group.keys = keys;
    group.placeholder = placeholder;
    group.parent = parent;
    group.completion = completion;

    /**
     * Initial value needed, if we empty search box or want to clear it, it needs to be reset.
     * Setting copy, used if user wants to remove values (by id.). This _ list gets filtered.
     */
    group.SetValues(value);

    return group;
}