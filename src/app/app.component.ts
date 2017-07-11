import {AfterViewInit, Component, OnInit, QueryList, ViewChildren} from "@angular/core";
import {CreateNewAutocompleteGroup} from "./ng-autocomplete/classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "./ng-autocomplete/classes/typing";
import {NgAutocompleteComponent} from "./ng-autocomplete/ng-autocomplete.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
    @ViewChildren(NgAutocompleteComponent) public completers: QueryList<NgAutocompleteComponent>;

    public group1 = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer_one',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ],
            {titleKey: 'title', childrenKey: null},
            ''
        ),
    ];
    public group2 = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer_one',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ],
            {titleKey: 'title', childrenKey: null},
            ''
        ),
    ];

    constructor() {

    }

    /**
     *
     */
    ngAfterViewInit() {
        console.log(NgAutocompleteComponent.FindCompleter('group1', this.completers));
    }

    /**
     *
     * @param item
     * @constructor
     */
    Selected(item: SelectedAutocompleteItem) {
        console.log(item);
    }
}
