import {AutocompleteItem} from "./AutocompleteItem";
import {FilterRemovals} from "../utils/utils";

export class AutocompleteGroup {
    initialValue: AutocompleteItem[] = [];

    key: string;
    keys: { titleKey: string, childrenKey: string | null };
    value: AutocompleteItem[];
    remove: string[];
    placeholder: string;
    parent: string;
    completion: boolean;

    private removals: string[] = [];
    private _copy: AutocompleteItem[] = [];

    constructor() {

    }

    /**
     *
     * @param value
     * @param titleKey
     * @constructor
     */
    SetValue(value: { id: string; [value: string]: any }[], titleKey: string) {
        const values = value.map((item) => AutocompleteItem.TransformToAutocompleteItem(item, titleKey));
        this.SetCopy(values);

        /**
         *
         * @type {AutocompleteItem[]}
         */
        this.value = FilterRemovals(this.removals, values);
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
        this.value = FilterRemovals(this.removals, this._copy);
    }

    /**
     *
     * @constructor
     */
    InitialValue() {
        this.value = FilterRemovals(this.removals, this.initialValue);

        /**
         *
         */
        this.SetCopy(this.initialValue);
    }

    /**
     *
     * @constructor
     */
    SetCopy(values: AutocompleteItem[]) {
        this._copy = Object.assign([], values);
    }

}

export function CreateNewAutocompleteGroup<T>(placeholder: string, key: string, value: { id?: string; [value: string]: any }[], keys: { titleKey: string, childrenKey: string | null }, parent: string = '', completion: boolean = true): AutocompleteGroup {
    const group = new AutocompleteGroup();

    group.key = key;
    group.keys = keys;
    group.value = value.map((item) => AutocompleteItem.TransformToAutocompleteItem(item, keys.titleKey, keys.childrenKey));
    group.placeholder = placeholder;
    group.parent = parent;
    group.completion = completion;

    /**
     * Initial value needed, if we empty search box or want to clear it, it needs to be reset.
     * Setting copy, used if user wants to remove values (by id.). This _ list gets filtered.
     */
    group.initialValue = Object.assign([], group.value);
    group.SetCopy(Object.assign([], group.value));

    return group;
}