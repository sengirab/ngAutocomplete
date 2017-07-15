import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";

@Directive({
    selector: '[ngDropdown]'
})
export class NgDropdownDirective implements OnChanges, OnInit, OnDestroy {
    @Input() public list: any[] = [];
    @Input() public active: any = null;
    @Input() public ref: Element = null;
    @Input() public key: string = '';
    @Input() public completion: boolean = true;

    @Output() public hover: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();
    @Output() public closed: EventEmitter<any> = new EventEmitter<any>();

    _open: boolean = false;
    _list: { active: boolean, [value: string]: any }[] = [];
    _class: string = '';

    constructor(public _eref: ElementRef) {
    }

    /**
     *
     */
    ngOnInit() {
        this._class = `dr-item-${this.key}-`;

        if (this.RefExists()) {
            this.ref.addEventListener('click', () => {
                if (!this._open) {
                    this._open = true;

                    /**
                     *
                     */
                    this.PrepareList();
                }
            });

            this.ref.addEventListener('keydown', (event: KeyboardEvent) => {
                this.keyDown(event);
            });
        }

        if(!this.completion) {
            document.addEventListener('keydown', (event: KeyboardEvent) => {
                if(this._open) {
                    this.keyDown(event);
                }
            });
        }

        /**
         *
         * @private
         */
        this.PrepareList();
    }

    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (typeof changes['active'] !== 'undefined' && !changes['active'].firstChange) {
            this.PrepareList();
        }
        if (typeof changes['list'] !== 'undefined') {
            this.list = changes['list'].currentValue;

            /**
             *
             */
            this.PrepareList();
        }
    }

    /**
     *
     * @param event
     */
    keyDown(event: KeyboardEvent) {
        event.stopImmediatePropagation();
        event.stopPropagation();

        /**
         *
         */
        switch (event.code) {
            case 'ArrowDown':
                if (!this._open) {
                    this._open = true;
                    this.PrepareList();
                }

                /**
                 *
                 */
                this.SetActive(this.FindActive() + 1);
                event.preventDefault();
                break;
            case 'ArrowUp':
                if (!this._open) {
                    this._open = true;
                    this.PrepareList();
                }

                /**
                 *
                 */
                this.SetActive(this.FindActive() - 1);
                event.preventDefault();
                break;
            case 'Enter':
                this.selected.emit(this.DeReference(this._list[this.FindActive()]));
                this.Close(null, true);

                event.preventDefault();
                break;
            case 'Escape':
                this.Close(null, true);

                event.preventDefault();
                break;
            case 'Tab':
                this.Close(null, true);
                break;
            default:
                return;
        }
    }

    // =======================================================================//
    // ! Bindings                                                             //
    // =======================================================================//

    /**
     *
     * @returns {boolean}
     */
    @HostBinding('class.open')
    get opened() {
        return this._open;
    }


    // =======================================================================//
    // ! Listeners                                                            //
    // =======================================================================//

    /**
     *
     * @param event
     */
    @HostListener('mouseover', ['$event'])
    onMouseOver(event: KeyboardEvent) {
        const el: any = event.target || event.srcElement;

        /**
         *
         */
        if (el.id.length > 0 && el.id.includes(this._class)) {
            this.SetActive(Number(el.id.slice(this._class.length, el.id.length)));
        }
    }

    /**
     *
     * @constructor
     */
    @HostListener('document:click', ['$event'])
    Close(event: Event, force: boolean = false) {
        const close = () => {
            this._open = false;
            this.ClearActive();

            /**
             * Emit NULL so listening components know what to do.
             */
            this.hover.emit(null);
            this.closed.emit();
        };

        if (force) {
            close();
            return;
        }

        if ((this._open && (!this._eref.nativeElement.contains(event.target) && event.target !== this.ref))) {
            close();
        }
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     * @returns {boolean}
     * @constructor
     */
    RefExists() {
        return typeof this.ref !== 'undefined';
    }

    /**
     *
     * @private
     */
    FindActive(): number {
        return this._list.reduce((result, item, index) => {
            if (item.active) {
                result = index;
            }

            return result;
        }, -1);
    }

    /**
     *
     * @param index
     * @private
     */
    SetActive(index: number) {
        if (index > this._list.length - 1 || index < 0) return;

        /**
         *
         */
        this.ClearActive();

        this._list[index].active = true;
        this.hover.emit(this.DeReference(this._list[index]));
        this._eref.nativeElement.children[index].classList.add('active');
    }

    /**
     *
     * @private
     */
    ClearActive(): void {
        this._list.forEach((item, index) => {
            item.active = false;

            /**
             *
             * @type {string}
             */
            this._eref.nativeElement.children[index].classList.remove('active');
        });
    }

    /**
     *
     * @returns {[{item: any, active: boolean}]}
     * @constructor
     */
    PrepareList() {
        this._list = this.list.map((item) => {
            return {
                item: item,
                active: this.ActiveItem(item)
            }
        });

        /**
         *
         */
        this.PrepareChildrenList();
    }

    /**
     *
     * @param item
     * @returns {boolean}
     * @constructor
     */
    ActiveItem(item: any) {
        return this.active !== null && item.id === this.active.id;
    }

    /**
     *
     * @constructor
     */
    DetermineActiveClass() {
        this._list.forEach((item, index) => {
            if (typeof this._eref.nativeElement.children[index] === 'undefined') {
                return;
            }

            /**
             *
             */
            this._eref.nativeElement.children[index].classList.remove('active');
            if (item.active)
                this._eref.nativeElement.children[index].classList.add('active');
        })

    }

    /**
     *
     * @constructor
     */
    PrepareChildrenList() {
        const list = this._eref.nativeElement.children;

        setTimeout(() => {
            for (let i = 0; i < list.length; i++) {
                list[i].id = this._class + i;
            }
        }, 0);

        /**
         *
         */
        this.DetermineActiveClass();

    };

    /**
     *
     * @constructor
     * @param object
     */
    DeReference(object: { active: boolean, [value: string]: any }) {
        const {item} = object;

        /**
         *
         */
        return Object.assign({}, {...item});
    }

    /**
     *
     */
    ngOnDestroy() {
        if (this.RefExists()) {
            this.ref.removeEventListener('focus');
            this.ref.removeEventListener('keydown');

        }

        if(!this.completion) {
            document.removeEventListener('keydown');
        }
    }
}
