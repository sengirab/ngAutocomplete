import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from "@angular/core";
import {AutocompleteGroup} from "./classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "./classes/typing";
import {CompleterComponent} from "./completer/completer.component";
import {ReturnStringArrayByID} from "./utils/utils";

@Component({
    selector: 'ng-autocomplete',
    template: `
        <ng-completer [ngClass]="classes" *ngFor="let item of group" (cleared)="InputCleared($event)"
                      (selected)="ListenToSelected($event)"
                      [group]="item"></ng-completer>
    `
})
export class NgAutocompleteComponent implements OnInit {
    @ViewChildren(CompleterComponent) public completers: QueryList<CompleterComponent>;
    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();

    @Input() public group: AutocompleteGroup[] = [];
    @Input() public key: string = '';
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
            if(group.key === key) {
                this.ResetInput(group.key);
            }

            /**
             *
             */
            if (group.parent === key) {
                this.ResetInput(group.key);
                group.InitialValue();
            }
        });

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChange()
    }

    /**
     *
     * @param selected
     * @constructor
     */
    SetChildren(selected: SelectedAutocompleteItem) {
        this.group.forEach((item) => {

            if (item.parent == selected.group.key) {
                this.ResetInput(item.key);

                /**
                 *
                 */
                if (selected.item !== null && typeof selected.item.children !== 'undefined') {
                    item.SetNewValue(selected.item.children, selected.group.keys.titleKey);
                }
            }
        });

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChange()
    }

    /**
     *
     * @constructor
     */
    TriggerChange() {
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
    FindInput(key: string): CompleterComponent {
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
    ResetInput(key: string) {
        const completer = this.FindInput(key);
        completer.ClearValue();
    }

    /**
     *
     * @param key
     * @param values
     * @constructor
     */
    SetValues(key:string, values: { id?: string|number; [value: string]: any }[]) {
        const completer = this.FindInput(key);
        completer.group.SetValues(values);

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChange()
    }

    /**
     *
     * @param key
     * @param id
     * @constructor
     */
    SelectItem(key: string, id: string|number) {
        const completer = this.FindInput(key);

        /**
         *
         */
        completer._items.forEach((item) => {
            if(item.id === id) {
                completer.SelectItem(item);
            }
        })
    }

    /**
     *
     * @param key
     * @param ids
     * @constructor
     */
    RemovableValues(key: string, ids: { id: string|number, [value: string]: any }[]) {
        const completer = this.FindInput(key);
        completer.group.Removables(ReturnStringArrayByID(ids));

        /**
         * Items may have changed, need to te re-set list in completer components.
         */
        this.TriggerChange()
    }

    /**
     *
     * @constructor
     */
    ResetInputs() {
        this.group.forEach((item) => {
            this.ResetInput(item.key);
        });
    }

    // =======================================================================//
    // ! Static (utils)                                                       //
    // =======================================================================//

    /**
     *
     * @constructor
     */
    static FindCompleter(key: string, list: QueryList<NgAutocompleteComponent>): NgAutocompleteComponent {
        const completer = list.filter((completer: NgAutocompleteComponent) => {
            return key === completer.key;
        });

        if(typeof completer[0] !== 'undefined') {
            return completer[0]
        }

        return null
    }
}
