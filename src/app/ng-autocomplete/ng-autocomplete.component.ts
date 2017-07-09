import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from "@angular/core";
import {AutocompleteGroup} from "./classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "./classes/typing";
import {CompleterComponent} from "./completer/completer.component";
import {ReturnStringArrayByID} from "./utils/utils";

@Component({
    selector: 'ng-autocomplete',
    template: `
        <ng-completer [ngClass]="classes" *ngFor="let item of group" (cleared)="InputCleared($event)" (selected)="ListenToSelected($event)"
                       [group]="item"></ng-completer>
    `
})
export class NgAutocompleteComponent implements OnInit {
    @ViewChildren(CompleterComponent) public completers: QueryList<CompleterComponent>;
    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();

    @Input() public group: AutocompleteGroup[] = [];
    @Input() public classes: string[] = [];

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {
    }

    /**
     *
     * @constructor
     * @param selected
     */
    ListenToSelected(selected: SelectedAutocompleteItem) {
        this.selected.emit(selected);

        /**
         *
         */
        this.SetChildren(selected);
    }

    /**
     *
     * @constructor
     */
    InputCleared(key: string) {
        this.group.forEach((group) => {
            if (group.parent === key) {
                this.ResetCompleter(group.key);

                /**
                 *
                 */
                group.InitialValue();
            }
        });

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChangeCompleters()
    }

    /**
     *
     * @param selected
     * @constructor
     */
    SetChildren(selected: SelectedAutocompleteItem) {
        this.group.forEach((item) => {

            if (item.parent == selected.group.key) {
                this.ResetCompleter(item.key);

                /**
                 *
                 */
                if (selected.item !== null && typeof selected.item.children !== 'undefined') {
                    item.SetValue(selected.item.children, selected.group.keys.titleKey);
                }
            }
        });

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChangeCompleters()
    }

    /**
     *
     * @constructor
     */
    TriggerChangeCompleters() {
        this.completers.forEach((completer) => {
            completer.SetItems();
        })
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     * @param key
     * @returns {CompleterComponent}
     * @constructor
     */
    FindCompleter(key: string): CompleterComponent {
        return this.completers.reduce((result, completer) => {
            if (completer.group.key === key) {
                result = completer;
            }

            return result
        }, <CompleterComponent>{})
    }

    /**
     *
     * @param key
     * @constructor
     */
    ResetCompleter(key: string) {
        const completer = this.FindCompleter(key);
        completer.ClearValue();
    }

    /**
     *
     * @param key
     * @param ids
     * @constructor
     */
    RemovableValues(key: string, ids: { id: string, [value: string]: any }[]) {
        const completer = this.FindCompleter(key);
        completer.group.Removables(ReturnStringArrayByID(ids));

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChangeCompleters()
    }

    /**
     *
     * @constructor
     */
    ResetCompleters() {
        this.group.forEach((item) => {
            this.ResetCompleter(item.key);
        });
    }
}
