import {AfterViewInit, Component, QueryList, ViewChildren} from "@angular/core";
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
            'Completer with children',
            [
                {
                    title: 'Option 1', id: '1', children: [
                    {title: 'Option 4', id: '1'},
                    {title: 'Option 5', id: '2'},
                    {title: 'Option 6', id: '3'},
                ]
                },
                {
                    title: 'Option 2', id: '2', children: [
                    {title: 'Option 7', id: '1'},
                    {title: 'Option 8', id: '2'},
                    {title: 'Option 9', id: '3'},
                ]
                },
                {
                    title: 'Option 3', id: '3', children: [
                    {title: 'Option 10', id: '1'},
                    {title: 'Option 11', id: '2'},
                    {title: 'Option 12', id: '3'},
                ]
                },
            ],
            {titleKey: 'title', childrenKey: 'children'}
        ),
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'Completer listening to parent with children',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ],
            {titleKey: 'title', childrenKey: null},
            'Completer with children',
        ),
    ];

    public group2 = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'Normal completer',
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
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'Disabled completer, only selectable values.',
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ],
            {titleKey: 'title', childrenKey: null},
            '',
            false
        ),
    ];

    public group3 = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'Lots of items',
            this.FillArray(),
            {titleKey: 'title', childrenKey: null},
            ''
        )
    ];

    FillArray() {
        let arr = [];
        for (let i = 0; i < 2000; i++) {
            arr.push({title: `Option ${i}`, id: i});
        }

        return arr;
    }

    constructor() {

    }

    /**
     *
     */
    ngAfterViewInit() {
        console.log();
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
