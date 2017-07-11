# NgAutoComplete / Example
Light-weight autocomplete component for Angular2.

https://github.com/sengirab/ng-autocomplete

![](https://raw.githubusercontent.com/sengirab/ng-autocomplete/master/demo.gif)

# Changelog - (Read before updating.)

## [1.0.0] - 2017-07-11. Releasing since it's being used.
### Renamed Functions.

- ResetCompleters to ResetInputs.
- ResetCompleter to ResetInput.
- FindCompleter to FindInput.
- TriggerChangeCompleters to TriggerChange.

### New Functionality.
- <ng-autocomplete [key]="'group1'"></ng-autocomplete> - Added key on component.
- static FindCompleter usage (NgAutocompleteComponent.FindCompleter()) (not to be confused with the old FindCompleter, now FindInput)
    - (key: string, list: QueryList<NgAutocompleteComponent>): NgAutocompleteComponent. This can be useful when you have multiple ng-autocomplete components
    in one component. Note that this  can only be used when the view has been init.

# Installation

`npm i ng-auto-complete --save`

# Styling !important
First thing to note, i've created this package to be as simple as possible. That's why i don't include any styling,
this is so you could style it the way you want it.

If you like the styling i did for the example .gif shown above, you can copy it from [here.](https://github.com/sengirab/ng-autocomplete/blob/master/src/styles.css) 

# Usage

#### app.module.ts
```typescript
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {NgAutoCompleteModule} from "ng-auto-complete";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgAutoCompleteModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

#### app.component.ts
```typescript
import {Component, ViewChild} from "@angular/core";
import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
    
    public group = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer',
            [
                {title: 'Option 1', id: '1'},
                {title: 'Option 2', id: '2'},
                {title: 'Option 3', id: '3'},
                {title: 'Option 4', id: '4'},
                {title: 'Option 5', id: '5'},
            ],
            {titleKey: 'title', childrenKey: null}
        ),
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

```

#### app.component.html
```html
<ng-autocomplete (selected)="Selected($event)" [classes]="['']" [group]="group"></ng-autocomplete>
```

# Remove selected values
```typescript
public selected: any[] = [];

Selected(item: SelectedAutocompleteItem) {
    this.selected.push(item.item);

    /**
     * Remove selected values from list,
     * selected value must be of type: {id: string(based on GUID's), [value: string]: any}[]
     */
    this.completer.RemovableValues('completer', this.selected)
}
```

# Turn off completion
In some cases you may want to disable auto completion. e.g you want a html select element.
### Example
![](https://raw.githubusercontent.com/sengirab/ng-autocomplete/master/demo2.gif)
### Usage
```typescript    
public group = [
    CreateNewAutocompleteGroup(
        'Search / choose in / from list',
        'completer',
        [
            {title: 'Option 1', id: '1'},
            {title: 'Option 2', id: '2'},
            {title: 'Option 3', id: '3'},
            {title: 'Option 4', id: '4'},
            {title: 'Option 5', id: '5'},
        ],
        {titleKey: 'title', childrenKey: null},
        '',
        false
    )
];
```

# With children
### Usage
```typescript    
public group = [
    CreateNewAutocompleteGroup(
        'Search / choose in / from list',
        'completer_one',
        [
            {
                title: 'Option 1', id: '1',
                children: [
                    {title: 'Option 1', id: '1'},
                    {title: 'Option 2', id: '2'}
                ]
            },
            {
                title: 'Option 2', id: '2',
                children: [
                    {title: 'Option 3', id: '3'},
                    {title: 'Option 4', id: '4'}
                ]
            },
            {
                title: 'Option 3', id: '3',
                children: [
                    {title: 'Option 5', id: '5'},
                    {title: 'Option 6', id: '6'}
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
            {title: 'Option 1', id: '1'},
            {title: 'Option 2', id: '2'},
            {title: 'Option 3', id: '3'},
            {title: 'Option 4', id: '4'},
            {title: 'Option 5', id: '5'},
            {title: 'Option 6', id: '6'},
        ],
        {titleKey: 'title', childrenKey: null},
        'completer_one'
    )
];
```

# Within a form

### Usage:
```typescript
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
    
    public form: FormGroup;
    public group = [
        CreateNewAutocompleteGroup(
            'Search / choose in / from list',
            'completer',
            [
                {title: 'Option 1', id: '1'},
                {title: 'Option 2', id: '2'},
                {title: 'Option 3', id: '3'},
                {title: 'Option 4', id: '4'},
                {title: 'Option 5', id: '5'},
            ],
            {titleKey: 'title', childrenKey: null}
        ),
    ];

    constructor(private _fb: FormBuilder) {

    }
    
    /**
     *
     */
    ngOnInit() {
        this.form = this._fb.group({
            items: new FormArray([])
        });
    }

    /**
     *
     * @param item
     * @constructor
     */
    Selected(item: SelectedAutocompleteItem) {
        (<FormArray>this.form.controls['items']).push(new FormArray(item.item.original));
        console.log(item);
    }
}
```


# NgAutocompleteComponent Functions

### Note:

<p>I have made all NgAutocompleteComponent and CompleterComponent functions public, so you could do a lot more than i'll show you<p>
<p>I've documented the functions of which i think their useful:<p>

### Usage
```typescript
@ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
```

| Left-aligned | Center-aligned |
| :---         |     :---:      |
| FindCompleter((key: string, list: QueryList<NgAutocompleteComponent>)) (Static function) | Finds completer |
| ResetInputs()   | Resets all rendered completer inputs |
| FindInput(key: string)     | Find completer input by assigned key |
| RemovableValues(key: string, list: {id: string, [value: string]: any}[]) | Remove options from rendered list (by id) |

# CompleterComponent Functions

### Usage
```typescript
@ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
public input = this.completer.FindCompleter('completer');
```

| Left-aligned | Center-aligned |
| :---         |     :---:      |
| ClearValue()   | Clears found completer's input. |
