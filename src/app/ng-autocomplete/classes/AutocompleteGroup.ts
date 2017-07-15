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
    SetNewValue(value: { id: string|number; [value: string]: any }[], titleKey: string) {
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

    /**
     *
     * @param value
     * @constructor
     */
    SetValues(value: { id?: string|number; [value: string]: any }[]) {
        this.value = value.map((item) => AutocompleteItem.TransformToAutocompleteItem(item, this.keys.titleKey, this.keys.childrenKey));

        /**
         *
         */
        this.initialValue = Object.assign([], this.value);
        this.SetCopy(Object.assign([], this.value));
    }
}

export function CreateNewAutocompleteGroup<T>(placeholder: string, key: string, value: { id?: string|number; [value: string]: any }[], keys: { titleKey: string, childrenKey: string | null }, parent: string = '', completion: boolean = true): AutocompleteGroup {
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