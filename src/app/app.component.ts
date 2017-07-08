import {Component} from "@angular/core";
import {CreateNewAutocompleteGroup} from "./ng-autocomplete/classes/AutocompleteGroup";
import {SelectedAutocompleteItem} from "./ng-autocomplete/classes/typing";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    public group = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer_one',
            [
                {
                    title: 'Option 1', id: '1',
                    children: [
                        {title: 'Option 4', id: '1'},
                        {title: 'Option 5', id: '2'}
                    ]
                },
                {
                    title: 'Option 2', id: '2',
                    children: [
                        {title: 'Option 6', id: '3'},
                        {title: 'Option 7', id: '4'}
                    ]
                },
                {
                    title: 'Option 3', id: '3',
                    children: [
                        {title: 'Option 8', id: '5'},
                        {title: 'Option 9', id: '6'}
                    ]
                },
            ],
            {titleKey: 'title', childrenKey: 'children'},
            ''
        ),
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer_two',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ],
            {titleKey: 'title', childrenKey: null},
            'completer_one'
        )
    ];

    constructor() {

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
