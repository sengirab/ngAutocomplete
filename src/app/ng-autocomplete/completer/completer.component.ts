import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {AutocompleteGroup} from "../classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "../classes/typing";
import {AutocompleteItem} from "../classes/AutocompleteItem";
import {NgDropdownDirective} from "../dropdown/ng-dropdown.directive";

@Component({
    selector: 'ng-completer',
    template: `<div class="ng-autocomplete-dropdown">

        <!--GROUP: {{group.key}}-->

        <div class="ng-autocomplete-inputs" (click)="RegisterClick()">
            <span class="ng-autocomplete-placeholder" *ngIf="_DOM.placeholder.length > 0">{{_DOM.placeholder}}</span>
            <input #input type="text" [placeholder]="group.placeholder" name="completer" [(ngModel)]="_completer" (ngModelChange)="OnModelChange($event)"
                   autocomplete="off" [ngClass]="{'completion-off': !group.completion}" [disabled]="!group.completion" (click)="RegisterClick()">
        </div>

        <div class="ng-dropdown" ngDropdown [list]="_items" [ref]="input" [active]="_DOM.selected"
             (hover)="OnHoverDropdownItem($event)"
             (selected)="SelectItem($event)"
             (closed)="OnInputBlurred()"
        >
            <div class="dropdown-item" *ngFor="let item of _items; let i = index" (click)="SelectItem(item)">
                {{item.title}}
            </div>
        </div>
    </div>`,
    styles: [`
        .ng-autocomplete-dropdown .ng-dropdown {
            display: none;
        }
        .ng-autocomplete-dropdown .ng-autocomplete-inputs input.completion-off {
            cursor: pointer;
        }
        .ng-autocomplete-dropdown .ng-dropdown.open {
            display: block;
        }
    `]
})
export class CompleterComponent implements OnInit {
    @ViewChild(NgDropdownDirective) public dropdown: NgDropdownDirective;

    @Output() public cleared: EventEmitter<string> = new EventEmitter<string>();
    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();
    @Input() public group: AutocompleteGroup = <AutocompleteGroup>{};

    _items: AutocompleteItem[] = [];
    _completer: string = '';

    _DOM = {
        placeholder: <string>'',
        selected: <AutocompleteItem>null
    };

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {
        this.SetItems();
    }

    /**
     * Only used when completion is off.
     * @constructor
     */
    RegisterClick() {
        if(!this.group.completion)
            this.dropdown._open = true;
    }

    /**
     *
     * @constructor
     */
    SetItems() {
        this._items = this.group.value;
    }

    /**
     *
     * @constructor
     */
    SelectItem(item: AutocompleteItem) {
        this._completer = item.title;

        /**
         *
         */
        this.dropdown.Close(null, true);
        this._DOM.selected = item;
        this.selected.emit({group: this.group, item: item});
    }

    /**
     *
     * @param value
     * @constructor
     */
    OnModelChange(value: string) {
        this._completer = value;

        if (value.length === 0) {
            this._DOM.selected = null;
            this.cleared.emit(this.group.key);
        }

        /**
         *
         * @type {AutocompleteItem[]}
         * @private
         */
        this._items = this.group.value.filter((item) => {
            return item.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
        })
    }

    /**
     *
     * @constructor
     */
    OnInputBlurred() {
        if (!this.HasChosenValue()) {

            /**
             * Let component know completer input has been cleared -
             * this function shows the list again, also resets children, if chosen.
             */
            this.OnModelChange('');
        }
    }

    /**
     *
     * @constructor
     */
    OnHoverDropdownItem(item: AutocompleteItem) {
        if (item == null) {
            this._DOM.placeholder = '';
            return;
        }

        this._DOM.placeholder = item.title;
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     * @constructor
     */
    HasChosenValue(): boolean {
        return this.group.value.reduce((result, item) => {
            if (item.title === this._completer) {
                result = true
            }

            return result
        }, false)
    }

    /**
     *
     * @constructor
     */
    ClearValue() {
        this._completer = '';
        this._DOM.selected = null;

        /**
         *
         */
        this.selected.emit({group: this.group, item: null});
    }
}
