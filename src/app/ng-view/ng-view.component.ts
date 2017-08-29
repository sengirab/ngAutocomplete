import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ng-view',
    templateUrl: './ng-view.component.html'
})
export class NgViewComponent implements OnInit {
    View: boolean = false;


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
     */
    SetView() {
        this.View =! this.View;
    }
}
