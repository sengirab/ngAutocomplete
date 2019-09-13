import { debounceTime } from 'rxjs/operators';
import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { AutocompleteGroup } from '../classes/AutocompleteGroup';
import {
    AutocompleteItem,
    ComparableAutoCompleteString,
    SearchableAutoCompleteString,
    StrippedAutocompleteGroup
} from '../classes/AutocompleteItem';
import { NgDropdownDirective } from '../dropdown/ng-dropdown.directive';
import { GroupNoResult } from '../utils/utils';
import { Subject } from 'rxjs';

@Component({
    selector: 'ng-completer',
    template: `
        <div #element class="ng-autocomplete-dropdown"
             [ngClass]="{'open': dropdown._open, 'is-loading': _DOM.isLoading, 'is-async': group.async !== null}">

            <!--GROUP: {{group.key}}-->

            <div class="ng-autocomplete-inputs" (click)="RegisterClick()"
                 [ngClass]="{'completion-off': !group.completion}">
                <span class="ng-autocomplete-placeholder"
                      *ngIf="_DOM.placeholder">
                  <ng-container *ngIf="group.placeholderValue">
                      <ng-template *ngTemplateOutlet="group.placeholderValue; context: {$implicit: _DOM.placeholder}"></ng-template>
                  </ng-container>
                  <ng-template [ngIf]="!group.placeholderValue">
                      {{_DOM.placeholder.title}}
                  </ng-template>
                </span>
                <input #input type="text" [placeholder]="group.placeholder" name="completer" [ngModel]="_completer"
                       (ngModelChange)="_change.next($event);"
                       [value]="_completer"
                       [tabIndex]="_disabled ? -1 : 0"
                       autocomplete="new-password"
                       (focus)="OpenDropdown()" class="ng-autocomplete-input">

                <span [ngClass]="{'open': dropdown._open}" class="ng-autocomplete-dropdown-icon"
                      (click)="DropdownArray()"></span>
            </div>

            <div class="ng-dropdown" ngDropdown [list]="_items" [element]="element" [input]="input"
                 [ngClass]="{'is-initial-empty': _DOM.empty}"
                 [active]="_DOM.selected" [key]="group.key"
                 [completion]="group.completion"
                 (hover)="OnHoverDropdownItem($event)"
                 (selected)="SelectItem($event)"
                 (closed)="OnInputBlurred()"
            >
                <div *ngIf="_DOM.notFound && group.noResults" class="dropdown-item no-results">
                    <ng-container *ngIf="group.noResults">
                        <ng-template *ngTemplateOutlet="group.noResults; context: {$implicit: _completer}"></ng-template>
                    </ng-container>
                </div>

                <div class="dropdown-item" *ngFor="let item of _items | keys; let i = index"
                     (click)="SelectItem(_items[item])" [ngClass]="_items[item].className">
                    <ng-container *ngIf="group.dropdownValue">
                        <ng-template
                            *ngTemplateOutlet="group.dropdownValue; context: {$implicit: _items[item], highlight: _items[item].title | highlight:_highlight}"></ng-template>
                    </ng-container>

                    <div *ngIf="!group.dropdownValue" [innerHTML]="_items[item].title | highlight:_highlight"></div>
                </div>
            </div>
        </div>`,
    styles: [`
        .ng-autocomplete-inputs {
            position: relative;
        }

        .ng-autocomplete-inputs input[type=text]::-ms-clear,
        .ng-autocomplete-inputs input[type=text]::-ms-reveal {
            display: none;
            width: 0;
            height: 0;
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

        .ng-autocomplete-dropdown .ng-dropdown.is-empty {
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
    _disabled: boolean = false;

    _DOM = {
        notFound: <boolean>false,
        empty: <boolean>false,
        placeholder: <AutocompleteItem>null,
        selected: <string>'',
        isLoading: <boolean>false

    };

    constructor(private _zone: NgZone) {
    }

    /**
     *
     */
    ngOnInit() {
        this._zone.runOutsideAngular(() => {

            this._change.pipe(
                debounceTime(300))
                .subscribe((value: string) => {
                    this._zone.run(() => {
                        if (this.group.async !== null) {
                            this.RunAsyncFunction(value);
                        } else {
                            this.OnModelChange(value);
                        }
                    });
                });
        });

        this.SetItems();
    }

    /**
     * Only used when completion is off.
     */
    RegisterClick() {
        if (!this.group.completion) {
            this.SwitchDropdownState();
        }
    }

    /**
     *
     */
    DropdownArray() {
        if (this.group.completion) {
            this.SwitchDropdownState();
        }
    }

    /**
     *
     */
    SwitchDropdownState() {
        if (this.dropdown._open) {
            this.CloseDropdown();
            return;
        }

        /**
         *
         */
        this.OpenDropdown();
    }

    /**
     *
     */
    CloseDropdown() {
        this.dropdown._open = false;

        /**
         *
         */
        this._DOM.placeholder = null;
    }

    /**
     *
     */
    OpenDropdown() {
        this.dropdown.Open();

        /**
         *
         */
        this._DOM.placeholder = null;
    }

    /**
     *
     */
    SetItems() {
        this._items = this.group.value;
        this.IsInitialEmpty();
    }

    /**
     *
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
     */
    async RunAsyncFunction(value: string) {
        this._completer = value;
        this._highlight = value;

        this._DOM.selected = null;

        if (value.length === 0) {
            this.group.InitialValue();
            this.ClearModel();

            this.dropdown.Close('', true);
        } else if (value.length > this.group.searchLength) {
            this._DOM.isLoading = true;

            const values = await this.group.async(value);
            this.group.SetNewValue(values, this.group.keys.titleKey);

            this._DOM.isLoading = false;

            this._items = this.group.value;
            this.EmptySearch(this._items, value);

            // User has typed something now, results could be shown. We need to remove the "is-initial-empty" class.
            this.IsInitialEmpty();
            this.dropdown.Open();
        }
    }

    /**
     *
     */
    OnModelChange(value: string) {
        this._completer = value;
        this._highlight = value;

        this._DOM.selected = null;

        if (value.length === 0) {
            this.ClearModel();
        } else if (value.length > this.group.searchLength) {
            this.CompareItemsAndSet(value);
        }
    }

    /**
     *
     */
    ClearModel() {
        this._DOM.selected = null;
        this._DOM.notFound = false;

        this.cleared.emit(this.group.key);
    }

    /**
     *
     */
    CompareItemsAndSet(value: string) {
        const obj = {};
        for (const key in this.group.value) {
            if (ComparableAutoCompleteString(key).toLowerCase().indexOf(value.toLowerCase()) > -1) {
                obj[key] = this.group.value[key];
            }
        }

        this._items = obj;
        this.EmptySearch(this._items, value);

        // User has typed something now, results could be shown. We need to remove the "is-initial-empty" class.
        this.IsInitialEmpty();
        this.dropdown.Open();
    }

    /**
     *
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
     */
    OnHoverDropdownItem(item: AutocompleteItem | string) {
        if (typeof item === 'string') {
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

    IsInitialEmpty() {
        if (Object.keys(this._items).length === 0 && this._completer.length === 0) {
            this._DOM.empty = true;
            return;
        }

        this._DOM.empty = false;
    }

    /**
     *
     */
    HasChosenValue(): boolean {
        return this._DOM.selected !== null;
    }

    /**
     *
     */
    EmptySearch(obj: Object, query: string) {
        if (Object.keys(obj).length > 0) {
            this._DOM.notFound = false;
            return;
        }

        this._DOM.notFound = true;
        this.noResult.emit({group: {key: this.group.key}, query: query});
    }

    /**
     *
     */
    ClearValue() {
        this._completer = '';
        this._DOM.selected = null;

        this.group.InitialValue();
        this.IsInitialEmpty();
        /**
         *
         */
        this.selected.emit({group: {key: this.group.key}, item: null});
    }
}
