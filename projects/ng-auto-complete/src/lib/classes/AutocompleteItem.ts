export interface StrippedAutocompleteGroup {
    group: { key: string };
    item: AutocompleteItem;
}

export class AutocompleteItem {
    title: string;
    id?: string | number;
    children: any[];
    original: any;
    className: string;

    constructor(title: string, id: string | number, className: string, original: any) {
        this.title = title;
        this.id = id;
        this.className = className;
        this.original = original;
    }
}

/**
 *
 */
export function SearchableAutoCompleteItems(items: { id?: string | number; [value: string]: any }[], titleKey: string, childrenKey: string | null = null): { [value: string]: AutocompleteItem } {
    return items.reduce(function (r, i) {
        const t = SearchableAutoCompleteString(i[titleKey], i.id);

        if (typeof r[t] === 'undefined') {
            r[t] = TransformToAutocompleteItem(i, titleKey, childrenKey);
        }

        return r;
    }, {});
}

/**
 *
 */
export function SearchableAutoCompleteString(key: string, id: string | number) {
    return `${key.replace(/ /g, '_')}_id_${String(id)}`;
}

/**
 *
 */
export function ComparableAutoCompleteString(str: string) {
    return str.replace(/_/g, ' ');
}

/**
 * object must have an ID
 */

export function TransformToAutocompleteItem(object: { id?: string | number; [value: string]: any, className?: string }, titleKey: string, childrenKey: string | null = null) {
    const item = new AutocompleteItem(object[titleKey], object.id, object.className, object);

    /**
     * if there are children, add these.
     */
    if (childrenKey !== null) {
        item.children = object[childrenKey];
    }

    return item;
}
