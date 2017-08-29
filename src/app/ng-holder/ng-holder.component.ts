import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateNewAutocompleteGroup } from '../ng-autocomplete/classes/AutocompleteGroup';
import { NgAutocompleteComponent } from '../ng-autocomplete/ng-autocomplete.component';

@Component({
    selector: 'app-ng-holder',
    templateUrl: './ng-holder.component.html'
})
export class NgHolderComponent implements OnInit {
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

    public group = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'group',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: 2},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: 4},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: 6},
            ],
            {titleKey: 'title', childrenKey: null},
            ''
        )
    ];

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {
        this.completer.SelectItem('group', 5)
    }

    /**
     *
     * @constructor
     */
    Selected() {
    }
}
