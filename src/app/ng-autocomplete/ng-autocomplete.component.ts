import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { AutocompleteGroup } from './classes/AutocompleteGroup';
import { SelectedAutocompleteItem } from './classes/typing';
import { CompleterComponent } from './completer/completer.component';
import { GroupNoResult, ReturnStringArrayByID } from './utils/utils';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'ng-autocomplete',
    template: `
        <div #init style="display: none;"><span class="after-view-init"></span></div>
        <ng-completer [ngClass]="classes" *ngFor="let item of group" (cleared)="InputCleared($event)"
                      (no-result)="NoResult($event)"
                      (selected)="ListenToSelected($event)"
                      [group]="item"></ng-completer>
    `
})
export class NgAutocompleteComponent implements OnInit, AfterViewChecked, OnChanges {
    @ViewChildren(CompleterComponent) public completers: QueryList<CompleterComponent>;
    @ViewChild('init') public init: ElementRef;

    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();
    @Output('no-result') public noResult: EventEmitter<GroupNoResult> = new EventEmitter<GroupNoResult>();

    @Input() public group: AutocompleteGroup[] = [];
    @Input() public key: string = '';
    @Input() public classes: string[] = [];

    _viewHasBeenInit: boolean = false;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    /**
     *
     */
    ngOnInit() {
    }

    /**
     *
     */
    ngAfterViewChecked() {
        let el = this.init.nativeElement.querySelector('.after-view-init');

        if (window.getComputedStyle(el).length > 0) {
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
     * @param group
     */
    NoResult(group: GroupNoResult) {
        this.noResult.emit(group)
    }

    /**
     *
     * @constructor
     */
    InputCleared(key: string) {
        this.group.forEach((group) => {
            if (group.key === key || group.parent === key) {
                this.ResetInput(group.key);
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
     * @param {string} key
     * @param {"noResults" | "selectedValue"} type
     * @param {TemplateRef<any>} template
     * @constructor
     */
    SetTemplate(key: string, type: 'noResults' | 'placeholderValue' | 'dropdownValue', template: TemplateRef<any>) {
        this.SubscribeInput(
            key,
            (completer) => {
              completer.group[type] = template;

              /**
               * Items may have changed, need to te re-set list in completer components.
               */
              this.TriggerChange();
            }
        );
    }

    /**
     *
     * @param {string} key
     * @param promise
     * @constructor
     */
    SetAsync(key: string, promise: (str: string) => Promise<{ id: string | number; [value: string]: any }[]>) {
        this.SubscribeInput(
            key,
            (completer) => {
              completer.group.async = promise;

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
                Object.keys(completer._items).forEach((key) => {
                    let f = `_id_${String(id)}`;
                    let c = key.substring(key.indexOf(f), key.length);

                    if (f === c) {
                        completer.SelectItem(completer._items[key]);
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
