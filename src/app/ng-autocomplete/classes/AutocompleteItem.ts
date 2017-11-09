export interface StrippedAutocompleteGroup {
    group: { key: string },
    item: AutocompleteItem
}

export class AutocompleteItem {

    title: string;
    id?: string | number;
    children: any[];
    original: any;

    constructor(title: string, id: string | number, original: any) {
        this.title = title;
        this.id = id;
        this.original = original;
    }

    /**
     * object must have an ID
     * @constructor
     */
    static TransformToAutocompleteItem(object: { id?: string | number; [value: string]: any }, titleKey: string, childrenKey: string | null = null) {
        const item = new AutocompleteItem(object[titleKey], object.id, object);

        /**
         * if there are children, add these.
         */
        if (childrenKey !== null) item.children = object[childrenKey];

        return item
    }

    /**
     *
     * @param items
     * @param titleKey
     * @param childrenKey
     * @returns {{id?: (string | number); [p: string]: any}}
     * @constructor
     */
    static SearchableAutoCompleteItems(items: { id?: string|number; [value: string]: any }[], titleKey: string, childrenKey: string | null = null): {[value: string]: AutocompleteItem} {
        return items.reduce((r, i) => {
            const t = AutocompleteItem.SearchableAutoCompleteString(i[titleKey], i.id);

            if(typeof r[t] === 'undefined') {
                r[t] = AutocompleteItem.TransformToAutocompleteItem(i, titleKey, childrenKey)
            }

            return r;
        }, {})
    }

    /**
     *
     * @param key
     * @param {string | number} id
     * @returns {string}
     * @constructor
     */
    static SearchableAutoCompleteString(key: string, id: string|number) {
        return `${key.replace(/ /g,"_")}_id_${String(id)}`;
    }

    /**
     *
     * @param {string} str
     * @returns {string}
     * @constructor
     */
    static ComparableAutoCompleteString(str: string) {
        return str.replace(/_/g," ");
    }
}