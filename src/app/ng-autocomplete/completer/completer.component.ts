import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {AutocompleteGroup} from "../classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "../classes/typing";
import {AutocompleteItem} from "../classes/AutocompleteItem";
import {NgDropdownDirective} from "../dropdown/ng-dropdown.directive";

@Component({
    selector: 'app-completer',
    template: `<div class="ng-autocomplete-dropdown">

        <!--GROUP: {{group.key}}-->

        <div class="ng-autocomplete-inputs">
            <span class="ng-autocomplete-placeholder" *ngIf="_DOM.placeholder.length > 0">{{_DOM.placeholder}}</span>
            <input #input type="text" [placeholder]="group.placeholder" name="completer" [(ngModel)]="_completer" (ngModelChange)="OnModelChange($event)"
                   autocomplete="off">
        </div>

        <div class="ng-dropdown" ngDropdown [list]="_items" [ref]="input"
             (hover)="OnHoverDropdownItem($event)"
             (selected)="SelectItem($event)"
             (closed)="OnInputBlurred()"
        >
            <div class="dropdown-item" *ngFor="let item of _items; let i = index" (click)="SelectItem(item)">
                {{item.title}}
            </div>
        </div>
    </div>`,
    styles: [`.ng-autocomplete-dropdown {
        position: relative;
    }
    .ng-autocomplete-dropdown .ng-autocomplete-inputs {
        position: relative;
    }
    .ng-autocomplete-dropdown .ng-autocomplete-inputs input {
        width: 100%;
        padding: 6px 20px;
        font-family: Arial;
        font-weight: normal;
        outline: none !important;
        font-size: 15px;
        height: 56px;
        border: 1px solid #e0e0e0;
    }
    .ng-autocomplete-dropdown .ng-autocomplete-inputs:after {
        content: '';
        display: block;
        width: 56px;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        border-left: 1px solid #e0e0e0;
        pointer-events: none;
        font-size: 12px;
        color: #758694;
        padding: 21px 0;
    }
    .ng-autocomplete-dropdown .ng-autocomplete-placeholder {
        position: absolute;
        margin: 3px;
        background-color: #fff;
        padding: 17px 18px;
        font-family: Arial;
        font-weight: normal;
        font-size: 15px;
        width: calc(100% - 4px);
    }
    .ng-autocomplete-dropdown .ng-dropdown {
        display: none;
        border: 1px solid #e0e0e0;
        z-index: 99999;
        max-height: 280px;
        overflow-x: hidden;
        position: absolute;
        width: 100%;
    }
    .ng-autocomplete-dropdown .ng-dropdown.open {
        display: block;
    }
    .ng-autocomplete-dropdown .ng-dropdown .dropdown-item {
        width: 100%;
        cursor: pointer;
        padding: 18px 20px;
        font-family: Arial;
        font-weight: normal;
        font-size: 15px;
        height: 56px;
        background-color: #ffffff;
    }
    .ng-autocomplete-dropdown .ng-dropdown .dropdown-item:nth-child(odd) {
        background-color: #efefef;
    }
    .ng-autocomplete-dropdown .ng-dropdown .dropdown-item.active {
        background-color: #0099cc;
        color: #fff !important;
    }
    .btn-autocomplete-add {
        width: 100%;
        height: 56px;
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
        placeholder: <string>''
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

        /**
         *
         */
        this.selected.emit({group: this.group, item: null});
    }
}
