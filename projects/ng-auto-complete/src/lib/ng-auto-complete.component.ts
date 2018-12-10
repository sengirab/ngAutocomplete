import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {AutocompleteGroup} from './classes/AutocompleteGroup';
import {SelectedAutocompleteItem} from './classes/typing';
import {CompleterComponent} from './completer/completer.component';
import {GroupNoResult, ReturnStringArrayByID} from './utils/utils';
import {Subject} from 'rxjs';

@Component({
    selector: 'ng-auto-complete',
    template: `
        <div #init style="display: none;"><span class="after-view-init"></span></div>
        <ng-completer [ngClass]="classes" *ngFor="let item of group" (cleared)="InputCleared($event)"
                      (no-result)="NoResult($event)"
                      (selected)="ListenToSelected($event)"
                      [group]="item"></ng-completer>
    `,
})
export class NgAutoCompleteComponent implements OnInit {
    @ViewChildren(CompleterComponent) public completers: QueryList<CompleterComponent>;
    @ViewChild('init') public init: ElementRef;

    @Output() public selected: EventEmitter<SelectedAutocompleteItem> = new EventEmitter<SelectedAutocompleteItem>();
    @Output('no-result') public noResult: EventEmitter<GroupNoResult> = new EventEmitter<GroupNoResult>();

    @Input() public group: AutocompleteGroup[] = [];
    @Input() public key: string = '';
    @Input() public classes: string[] = [];

    _viewHasBeenInit: boolean = false;
    _viewInitSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private cdr: ChangeDetectorRef) {
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
        if (!this._viewHasBeenInit) {
            let el = this.init.nativeElement.querySelector('.after-view-init');

            if (window.getComputedStyle(el).length > 0) {
                this._viewHasBeenInit = true;
                this._viewInitSubject.next(true);
            }
        }
    }

    /**
     *
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
     */
    NoResult(group: GroupNoResult) {
        this.noResult.emit(group);
    }

    /**
     *
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
        this.TriggerChange();
    }

    /**
     *
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
        this.TriggerChange();
    }

    /**
     *
     */
    TriggerChange() {
        this.completers.forEach((completer) => {
            completer.SetItems();
        });
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     */
    GetInput(key: string): CompleterComponent {
        return this.completers.reduce((result, completer) => {
            if (completer.group.key === key) {
                result = completer;
            }

            return result;
        }, <CompleterComponent>{});
    }

    /**
     *
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

        this._viewInitSubject.subscribe((_bool) => {
            let completer = this.GetInput(key);
            setTimeout(() => {
                f(completer);
            });

            this._viewInitSubject.unsubscribe();
        });
    }

    /**
     *
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
     */
    static FindCompleter(key: string, list: QueryList<NgAutoCompleteComponent>): NgAutoCompleteComponent {
        const completer = list.filter((completer: NgAutoCompleteComponent) => {
            return key === completer.key;
        });

        if (typeof completer[0] !== 'undefined') {
            return completer[0];
        }

        return null;
    }
}
