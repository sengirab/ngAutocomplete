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
import {IsMobileOrTablet} from "../utils/utils";

@Directive({
    selector: '[ngDropdown]'
})
export class NgDropdownDirective implements OnChanges, OnInit, OnDestroy {
    @Input() public list: any[] = [];
    @Input() public active: any = null;

    @Input() public input: Element = null;
    @Input() public element: Element = null;

    @Input() public key: string = '';
    @Input() public completion: boolean = true;

    @Output() public hover: EventEmitter<any> = new EventEmitter<any>();
    @Output() public selected: EventEmitter<any> = new EventEmitter<any>();
    @Output() public closed: EventEmitter<any> = new EventEmitter<any>();

    _open: boolean = false;
    _list: { active: boolean, [value: string]: any }[] = [];
    _class: string = '';
    wheelHandler: any;

    constructor(public _eref: ElementRef) {
    }

    /**
     *
     */
    ngOnInit() {
        this._class = `dr-item-${this.key}-`;

        if (this.RefExists()) {
            this.input.addEventListener('keydown', (event: KeyboardEvent) => {
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

        if(!IsMobileOrTablet()) {
            this._eref.nativeElement.addEventListener('mouseover', (event: MouseEvent) => {
                this.OnMouseOver(event);
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
                this.Open();

                /**
                 *
                 */
                this.SetActive(this.FindActive() + 1);
                this.DropdownFocusAreaDown();

                event.preventDefault();
                break;
            case 'ArrowUp':
                this.Open();

                /**
                 *
                 */
                this.SetActive(this.FindActive() - 1);
                this.DropdownFocusAreaUp();

                event.preventDefault();
                break;
            case 'Enter':
                this.EmitSelected();
                this.Close(null, true);

                event.preventDefault();
                break;
            case 'Escape':
                this.Close(null, true);

                event.preventDefault();
                break;
            case 'Tab':
                if(!event.shiftKey) {
                    this.EmitSelected();
                }

                this.Close(null, true);
                break;
            default:
                return;
        }
    }

    /**
     *
     * @param event
     */
    OnMouseOver(event: MouseEvent) {
        // Mouse didn't actually move, so no logic needed.
        if(event.movementX == 0 && event.movementY == 0) {
            return
        }

        /**
         *
         */
        const el: any = event.target || event.srcElement;
        if (el.id.length > 0 && el.id.includes(this._class)) {
            this.SetActive(Number(el.id.slice(this._class.length, el.id.length)));
        }
    }

    /**
     *
     * @constructor
     */
    EmitSelected() {
        if(this.FindActive() > -1) {
            this.selected.emit(this._list[this.FindActive()].key);
        }
    }

    /**
     *
     * @constructor
     */
    DropdownFocusAreaDown() {
        let scroll = this._eref.nativeElement.offsetHeight + this._eref.nativeElement.scrollTop;

        /**
         *
         */
        if((this.GetElement(this.FindActive()).offsetTop + this.GetElement(this.FindActive()).offsetHeight) > scroll) {
            this._eref.nativeElement.scrollTop = this.GetElement(this.FindActive()).offsetTop - (this._eref.nativeElement.offsetHeight - this.GetElement(this.FindActive()).offsetHeight)
        }
    }

    /**
     *
     * @constructor
     */
    DropdownFocusAreaUp() {
        let scroll = this._eref.nativeElement.scrollTop;

        /**
         *
         */
        if(this.GetElement(this.FindActive()).offsetTop < scroll && scroll > 0) {
            this._eref.nativeElement.scrollTop = this.GetElement(this.FindActive()).offsetTop;
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
     * @constructor
     */
    @HostListener('document:click', ['$event'])
    Close(event, force: boolean = false) {
        const close = () => {
            this._open = false;

            /**
             * Emit NULL so listening components know what to do.
             */
            this.ClearActive();
            this.hover.emit(null);
            this.closed.emit();
        };

        if (force) {
            close();
            return;
        }

        if ((this._open && (!this.element.contains(event.target)))) {
            close();
        }
    }

    // =======================================================================//
    // ! Utils                                                                //
    // =======================================================================//

    /**
     *
     * @constructor
     */
    Open() {
        if (!this._open) {
            this._open = true;
            this.PrepareList();

            /**
             *
             */
            if (this.FindActive() < 0) {
                setTimeout(() => {
                    this._eref.nativeElement.scrollTop = 0;
                }, 0);
            } else {
                setTimeout(() => {
                    this._eref.nativeElement.scrollTop = this.GetElement(this.FindActive()).offsetHeight * this.FindActive();
                }, 0);
            }
        }
    }

    /**
     *
     * @returns {boolean}
     * @constructor
     */
    RefExists() {
        return typeof this.input !== 'undefined';
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
        this.hover.emit(this._list[index].key);
        /**
         *
         */
        this.GetElement(index).classList.add('active');
    }

    /**
     *
     * @param index
     * @constructor
     */
    GetElement(index: number) {
        return this._eref.nativeElement.children[index];
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
            this.GetElement(index).classList.remove('active');
        });
    }

    /**
     *
     * @returns {[{item: any, active: boolean}]}
     * @constructor
     */
    PrepareList() {
        this._list = Object.keys(this.list).map((key) => {
            return {
                key,
                active: this.ActiveItem(key)
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
        return this.active !== null && item === this.active;
    }

    /**
     *
     * @constructor
     */
    DetermineActiveClass() {
        this._list.forEach((item, index) => {
            if (typeof this.GetElement(index) === 'undefined') {
                return;
            }

            /**
             *
             */
            this.GetElement(index).classList.remove('active');
            if (item.active)
                this.GetElement(index).classList.add('active');
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
            this.wheelHandler = this.removeEventListner.bind(this.input);
            // this.input.removeEventListener('keydown');
        }

        if(!this.completion) {
            this.wheelHandler = this.removeEventListner.bind(document);
            // document.removeEventListener('keydown');
        }

        if(!IsMobileOrTablet()) {
            this.wheelHandler = this.removeEventListner.bind(this._eref);
            // this._eref.nativeElement.removeEventListener('mouseover');
        }
    }

    removeEventListner(elem: Element) {
        elem.removeEventListener('wheel', this.wheelHandler, true);
    }
}
