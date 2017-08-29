import {
    AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { AutocompleteGroup } from './classes/AutocompleteGroup';
import { SelectedAutocompleteItem } from './classes/typing';
import { CompleterComponent } from './completer/completer.component';
import { ReturnStringArrayByID } from './utils/utils';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'ng-autocomplete',
    template: `
        <div #init style="display: none;"><span class="after-view-init"></span></div>
        <ng-completer [ngClass]="classes" *ngFor="let item of group" (cleared)="InputCleared($event)"
                      (selected)="ListenToSelected($event)"
                      [group]="item"></ng-completer>
    `
})
export class NgAutocompleteComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked {
    @ViewChildren(CompleterComponent) public completers: QueryList<CompleterComponent>;
    @ViewChild('init') public init: ElementRef;

    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();

    @Input() public group: AutocompleteGroup[] = [];
    @Input() public key: string = '';
    @Input() public classes: string[] = [];

    _viewHasBeenInit: boolean = false;

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {
    }

    /**
     *
     */
    ngAfterViewInit() {
    }

    /**
     *
     */
    ngAfterContentInit() {

    }

    /**
     *
     */
    ngAfterViewChecked() {
        let el = this.init.nativeElement.querySelector('.after-view-init');

        if(window.getComputedStyle(el).length > 0) {
            this._viewHasBeenInit = true;
        }
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
            if (group.key === key) {
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
     * @param {string} key
     * @returns {CompleterComponent}
     * @constructor
     */
    GetInput(key: string): CompleterComponent {
        return this.completers.reduce((result, completer) => {
            if (completer.group.key === key) {
                result = completer;
            }

            return result
        }, <CompleterComponent>{});
    }

    /**
     *
     * @param {string} key
     * @param {(completer: CompleterComponent) => void} f
     * @constructor
     */
    SubscribeInput(key: string, f: (completer: CompleterComponent) => void) {
        if (this._viewHasBeenInit) {
            let completer = this.GetInput(key);

            /**
             *
             */
            f(completer);
            return;
        }

        let s = this.FindInput(key).subscribe((completer) => {
            f(completer);

            /**
             *
             */
            s.unsubscribe();
        });
    }

    /**
     *
     * @param key
     * @returns {CompleterComponent}
     * @constructor
     */
    FindInput(key: string) {
        let s: Subject<CompleterComponent> = new Subject<CompleterComponent>();

        let i = setInterval(() => {
            if (this._viewHasBeenInit) {
                s.next(this.GetInput(key));
                s.complete();

                /**
                 *
                 */
                clearInterval(i);
            }
        }, 1000);

        return s;
    }

    /**
     *
     * @param key
     * @constructor
     */
    ResetInput(key: string) {
        this.SubscribeInput(
            key,
            (completer) => {
                completer.ClearValue();
            }
        );
    }

    /**
     *
     * @param key
     * @param values
     * @constructor
     */
    SetValues(key: string, values: { id?: string | number; [value: string]: any }[]) {
        this.SubscribeInput(
            key,
            (completer) => {
                completer.group.SetValues(values);

                /**
                 * Items may have changed, need to te re-set list in completer components.
                 */
                this.TriggerChange();
            }
        );
    }

    /**
     *
     * @param key
     * @param id
     * @constructor
     */
    SelectItem(key: string, id: string | number) {
        this.SubscribeInput(
            key,
            (completer) => {
                completer._items.forEach((item) => {
                    if (item.id == id) {
                        completer.SelectItem(item);
                    }
                });

            }
        );
    }

    /**
     *
     * @param key
     * @param ids
     * @constructor
     */
    RemovableValues(key: string, ids: { id: string | number, [value: string]: any }[]) {
        this.SubscribeInput(
            key,
            (completer) => {
                completer.group.Removables(ReturnStringArrayByID(ids));

                /**
                 * Items may have changed, need to te re-set list in completer components.
                 */
                this.TriggerChange();
            }
        );
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

        if (typeof completer[0] !== 'undefined') {
            return completer[0]
        }

        return null
    }
}
