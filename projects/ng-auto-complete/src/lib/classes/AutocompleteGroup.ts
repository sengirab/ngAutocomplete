import { AutocompleteItem, SearchableAutoCompleteItems } from './AutocompleteItem';
import { TemplateRef } from '@angular/core';

export class AutocompleteGroup {
    initialValue: { [value: string]: AutocompleteItem };

    key: string;
    keys: { titleKey: string, childrenKey: string | null };
    value: { [value: string]: AutocompleteItem };
    remove: string[];
    placeholder: string;
    parent: string;
    completion: boolean;
    searchLength: number;
    async: (str: string) => Promise<{ id: string | number; [value: string]: any }[]> = null;

    // Templates
    noResults: TemplateRef<any>;
    dropdownValue: TemplateRef<any>;
    placeholderValue: TemplateRef<any>;

    private removals: string[] = [];
    private _copy: { [value: string]: AutocompleteItem };

    constructor() {
    }

    /**
     *
     */
    SetNewValue(value: { id: string | number; [value: string]: any }[], titleKey: string) {
        const values = SearchableAutoCompleteItems(value, titleKey);
        this.SetCopy(values);

        /**
         *
         */
        this.value = this.FilterRemovals(this.removals, values);
    }

    /**
     *
     */
    Removables(ids: string[]) {
        this.removals = ids;

        /**
         *
         */
        this.value = this.FilterRemovals(this.removals, this._copy);
    }

    /**
     *
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
     */
    SetCopy(values: { [value: string]: AutocompleteItem }) {
        this._copy = Object.assign([], values);
    }

    /**
     *
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
 */
export function CreateNewAutocompleteGroup<T>(placeholder: string, key: string, value: { id?: string | number; [value: string]: any }[], keys: { titleKey: string, childrenKey: string | null }, parent: string = '', completion: boolean = true, searchLength: number = 2): AutocompleteGroup {
    const group = new AutocompleteGroup();

    group.key = key;
    group.keys = keys;
    group.placeholder = placeholder;
    group.parent = parent;
    group.completion = completion;
    group.searchLength = searchLength;

    /**
     * Initial value needed, if we empty search box or want to clear it, it needs to be reset.
     * Setting copy, used if user wants to remove values (by id.). This _ list gets filtered.
     */
    group.SetValues(value);

    return group;
}
