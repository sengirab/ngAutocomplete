import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { AutocompleteGroup } from '../classes/AutocompleteGroup';
import {
    AutocompleteItem, ComparableAutoCompleteString, SearchableAutoCompleteString,
    StrippedAutocompleteGroup
} from '../classes/AutocompleteItem';
import { NgDropdownDirective } from '../dropdown/ng-dropdown.directive';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import { GroupNoResult } from '../utils/utils';

@Component({
    selector: 'ng-completer',
    template: `
        <div #element class="ng-autocomplete-dropdown">

            <!--GROUP: {{group.key}}-->

            <div class="ng-autocomplete-inputs" (click)="RegisterClick()"
                 [ngClass]="{'completion-off': !group.completion, 'open': dropdown._open}">
                <span class="ng-autocomplete-placeholder"
                      *ngIf="_DOM.placeholder">
                  <ng-container *ngIf="group.placeholderValue">
                      <ng-template *ngTemplateOutlet="group.placeholderValue; context: {$implicit: _DOM.placeholder}"></ng-template>
                  </ng-container>
                  <ng-template [ngIf]="!group.placeholderValue">
                      {{_DOM.placeholder.title}}
                  </ng-template>
                </span>
                <input #input type="text" [placeholder]="group.placeholder" name="completer" [(ngModel)]="_completer"
                       (ngModelChange)="_change.next($event);"
                       [value]="_completer"
                       autocomplete="off"
                       (click)="OpenDropdown()"
                       (focus)="OpenDropdown()" class="ng-autocomplete-input">

                <span [ngClass]="{'open': dropdown._open}" class="ng-autocomplete-dropdown-icon"
                      (click)="DropdownArray()"></span>
            </div>

            <div class="ng-dropdown" ngDropdown [list]="_items" [element]="element" [input]="input"
                 [active]="_DOM.selected" [key]="group.key"
                 [completion]="group.completion"
                 (hover)="OnHoverDropdownItem($event)"
                 (selected)="SelectItem($event)"
                 (closed)="OnInputBlurred()"
            >
                <div *ngIf="_DOM.empty && group.noResults" class="dropdown-item no-results">
                    <ng-container *ngIf="group.noResults">
                        <ng-template *ngTemplateOutlet="group.noResults; context: {$implicit: _completer}"></ng-template>
                    </ng-container>
                </div>
                     
                <div class="dropdown-item" *ngFor="let item of _items | keys; let i = index"
                     (click)="SelectItem(_items[item])">
                  
                    <ng-container *ngIf="group.dropdownValue">
                        <ng-template *ngTemplateOutlet="group.dropdownValue; context: {$implicit: _items[item], highlight: _items[item].title | highlight:_highlight}"></ng-template>
                    </ng-container>
                  
                    <div *ngIf="!group.dropdownValue" [innerHTML]="_items[item].title | highlight:_highlight"></div>
                </div>
            </div>
        </div>`,
    styles: [`
        .ng-autocomplete-inputs {
            position: relative;
        }

        .ng-autocomplete-inputs.completion-off {
            cursor: pointer;
        }

        .ng-autocomplete-inputs.completion-off input {
            pointer-events: none;
        }

        .ng-autocomplete-placeholder {
            pointer-events: none;
        }

        .ng-autocomplete-dropdown-icon {

        }

        .ng-autocomplete-dropdown .ng-dropdown {
            display: none;
        }

        .ng-autocomplete-dropdown .ng-dropdown.open {
            display: block;
        }
    `]
})
export class CompleterComponent implements OnInit {
    @ViewChild(NgDropdownDirective) public dropdown: NgDropdownDirective;

    @Output() public cleared: EventEmitter<string> = new EventEmitter<string>();
    @Output() public selected: EventEmitter<StrippedAutocompleteGroup> = new EventEmitter<StrippedAutocompleteGroup>();
    @Output('no-result') public noResult: EventEmitter<GroupNoResult> = new EventEmitter<GroupNoResult>();

    @Input() public group: AutocompleteGroup = <AutocompleteGroup>{};

    _change: Subject<string> = new Subject<string>();
    _items: { [value: string]: AutocompleteItem } = {};
    _completer: string = '';
    _highlight: string = '';

    _DOM = {
        empty: <boolean>false,
        placeholder: <AutocompleteItem>null,
        selected: <string>''
    };

    constructor(private _zone: NgZone) {
    }

    /**
     *
     */
    ngOnInit() {
        this._zone.runOutsideAngular(() => {

            this._change
                .debounceTime(300)
                .subscribe((value: string) => {
                    this._zone.run(() => {
                        this.OnModelChange(value)
                    });
                });
        });

        this.SetItems();
    }

    /**
     * Only used when completion is off.
     * @constructor
     */
    RegisterClick() {
        if (!this.group.completion) {
            this.SwitchDropdownState()
        }
    }

    /**
     *
     * @constructor
     */
    DropdownArray() {
        if (this.group.completion) {
            this.SwitchDropdownState()
        }
    }

    /**
     *
     * @constructor
     */
    SwitchDropdownState() {
        if (this.dropdown._open) {
            this.CloseDropdown();
            return;
        }

        /**
         *
         */
        this.OpenDropdown()
    }

    /**
     *
     * @constructor
     */
    CloseDropdown() {
        this.dropdown._open = false;

        /**
         *
         * @type {string}
         */
        this._DOM.placeholder = null;
    }

    /**
     *
     * @constructor
     */
    OpenDropdown() {
        this.dropdown.Open();

        /**
         *
         * @type {string}
         */
        this._DOM.placeholder = null;
    }

    /**
     *
     * @constructor
     */
    SetItems() {
        this._items = this.group.value
    }

    /**
     *
     * @constructor
     */
    SelectItem(item: AutocompleteItem | string) {
        let i: AutocompleteItem;
        if (typeof item === 'string') {
            i = this._items[item];
            this._DOM.selected = item;
        } else {
            i = item;
            this._DOM.selected = SearchableAutoCompleteString(item.title, item.id);
        }

        this._completer = i.title;
        this._highlight = '';


        this.dropdown.Close(null, true);
        this.selected.emit({group: {key: this.group.key}, item: i});
    }

    /**
     *
     * @param value
     * @constructor
     */
    OnModelChange(value: string) {
        this._completer = value;
        this._highlight = value;

        if (value.length === 0) {
            this._DOM.selected = null;
            this._DOM.empty = false;

            this.cleared.emit(this.group.key);
        } else if (value.length > 2) {

            /**
             *
             * @type {AutocompleteItem[]}
             * @private
             */
            const obj = {};
            for (let key in this.group.value) {
                if (ComparableAutoCompleteString(key).toLowerCase().indexOf(value.toLowerCase()) > -1) {
                    obj[key] = this.group.value[key]
                }
            }

            this._items = obj;
            this.EmptySearch(this._items, value);
        }
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
    OnHoverDropdownItem(item: AutocompleteItem | string) {
        if (typeof item == 'string') {
            this._DOM.placeholder = this._items[item];
            return;
        }
        if (item == null) {
            this._DOM.placeholder = null;
            return;
        }

        this._DOM.placeholder = item;
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     * @constructor
     */
    HasChosenValue(): boolean {
        return this._DOM.selected !== null
    }

    /**
     *
     * @param {Object} obj
     * @param {string} query
     * @constructor
     */
    EmptySearch(obj: Object, query: string) {
        if(Object.keys(obj).length > 0) {
            this._DOM.empty = false;
            return
        }

        this._DOM.empty = true;
        this.noResult.emit({group: {key: this.group.key}, query: query})
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
        this.selected.emit({group: {key: this.group.key}, item: null});
    }
}
