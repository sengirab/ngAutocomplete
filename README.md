# NgAutoComplete / Example
Light-weight autocomplete component for Angular.

[![Code Climate](https://codeclimate.com/github/sengirab/ngAutocomplete/badges/gpa.svg)](https://codeclimate.com/github/sengirab/ngAutocomplete)
[![npm version](https://badge.fury.io/js/ng-auto-complete.svg)](https://badge.fury.io/js/ng-auto-complete)


https://github.com/sengirab/ngAutocomplete

![](https://raw.githubusercontent.com/sengirab/ngAutocomplete/master/demo.gif)

# Installation

`npm i ng-auto-complete --save`

# Styling !Important
First thing to note, i've created this package to be as simple as possible. That's why i don't include any styling,
this is so you could style it the way you want it.

If you like the styling i did for the example .gif shown above, you can copy it from [here.](https://github.com/sengirab/ngAutocomplete/blob/master/src/styles.css)
### Classes
- .ng-autocomplete-dropdown (.open .is-loading .is-async)
- .ng-autocomplete-inputs
- .ng-autocomplete-input
- .ng-autocomplete-placeholder
- .ng-autocomplete-dropdown-icon (.open)
- .ng-dropdown (.open .is-initial-empty)
- .dropdown-item (.active)


# Responses !Important
#### Response when selected
```json
"{group: AutocompleteGroup, item: AutocompleteItem}"
```
#### Response when cleared
```json
"{group: AutocompleteGroup, item: null}"
```
Note that when calling completer.ResetInput('completer'), this will clear the input. This means that the
completer will emit `{group: AutocompleteGroup, item: null}`. If your listening to this within your component
keep in mind that each clear the item will be null

The input will also emit "null" when the input reaches a length of `<= 0`.


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
![](https://raw.githubusercontent.com/sengirab/ngAutocomplete/master/demo2.gif)
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
        this.form.controls['items'] = this._fb.array([...this.form.controls['items'].value, item.original]);
       
        console.log(item);
    }
}
```

# Changelog - (Read before updating.)
## [2.10.5] - 2018-06-07
- Fixed an maximum callstack exceeded bug.
## [2.10.3] / [2.10.4] - 2018-06-06
- Added searchLength to options when create an autocomplete group, it configures when to fire a search. The number given is the amount of characters in the input.
## [2.10.2] - 2018-05-15.
- Removed dropdown it's own comparison when using Async. Assuming the user will probably filter the results.
## [2.10.1] - 2018-05-14.
- Added new classes to wrong element.
## [2.10.0] - 2018-05-14.
- Changes to behaviour of the dropdown (mainly for async).
  - Dropdown now only opens when there's a default value at start. It will stay closed until it has a list to show. -- Represented by the class: is-initial-empty.
  - Dropdown now has a loading class; is-loading.
  - Internal changes to keep the new code compatible with new behaviour.
## [2.9.12] - 2018-05-11.
### New Functionality.
- Support for async functions.
  - Useful for when you want to use your own API to return results.
  ```typescript
  @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

  const async = (str: string) => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve([
                  {
                      id: 0,
                      title: `Test case 1 ${str}`
                  },
                  {
                      id: 1,
                      title: `Test case 2 ${str}`
                  },
                  {
                      id: 2,
                      title: `Test case 3 ${str}`
                  }
              ])
          }, 2000)
      });
  };

  this.completer.SetAsync('completer', async);
  ```
## [2.8.12] - 2018-05-09.
### New Functionality.
- Created new functions to add custom ng-templates.
  - Every ng template receives a context that's equal to an AutocompleteItem type. Except for the dropdownValue, this receives a hightlight too. see example
  - template parameter must be of type: dropdownValue | placeholderValue | noResults
   ```typescript
    @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

    @ViewChild('dropdownValue') dropdownValue: TemplateRef<any>;
    @ViewChild('placeholderValue') placeholderValue: TemplateRef<any>;
    @ViewChild('noResults') noResults: TemplateRef<any>;

    this.completer.SetTemplate('completer', 'dropdownValue', this.dropdownValue);
    this.completer.SetTemplate('completer', 'noResults', this.noResults);
    this.completer.SetTemplate('completer', 'placeholderValue', this.placeholderValue);
    ```
    ```html
    <ng-template #dropdownValue let-value let-hightlight="highlight">
        <div [innerHTML]="hightlight"></div>
    </ng-template>
  
    <ng-template #placeholderValue let-value>
        {{value.title}}
    </ng-template>
    
    <ng-template #noResults let-value>
      Hey, you searched for: {{value}}. But there are no results!
    </ng-template>
    ```
## [2.7.12] - 2017-11-08.
- Big performance refactor.
    - Instead of using arrays, now uses objects. Search by object key.
- New @output, (no-results) emits GroupNoResult.
## [1.5.12], [1.6.12], [1.7.12] - 2017-08-29.
- A lot of internal changes & bugfixes.
- In some cases when the a view has a hidden ng-content, that shows if an expression evaluates to true and 
  a completer function has been used e.g(`SelectItem('completer', 5)`) it would give an error; completer view is not
  initialized. 
  - Functions that are called before the completer view has been initialized are now queued to be fired when the view
    is actually initialized.
## [1.4.12] - 2017-08-02.
- Added tab to submit events. (not preventing default, so still goes to the next input, if there's one).
- Added better support for navigating with arrows. Dropdown list now navigates to the selected item if the items exceed 
the dropdown its given height.
- Internal code cleanup.
## [1.3.12] - 2017-07-21.
- Mobile update: Remove mouseover when mobile. This prevents the user from needing to double tap the options.
## [1.3.11] - 2017-07-21.
### Styling
- Some internal styling has changed.
    - When completer is turned of, input used to be disabled. This doesn't work on all browsers. Input now get
    `pointer-events: none;`
- Browser compatibility.
### Fixes
- Value has to be set on input (equal to ngModel).
    - This created an issue on safari, when an item was selected, the placeholder didn't go away.
    

## [1.3.9] - 2017-07-20.
### Styling
- There's a new element `span.ng-autocomplete-dropdown-icon` this replaces the dropdown icon i did with css only.
### Other changes
- Increase of internal performance.
- Had some issues with Element refs. #fixed.
## [1.2.8] - 2017-07-15.
### New Functionality.
- It's now possible to instantiate CreateNewAutocompleteGroup with an empty array and set its value later. This can be useful
when you're waiting for an async task to complete.
     ```
        const component = NgAutocompleteComponent.FindCompleter('completer', this.completers);
        component.SetValues(
            'late', // <-- NOTE: this is the key of the input. You can call this what you want.
            [
                {title: 'Option 4', id: '1'},
                {title: 'Option 5', id: '2'},
                {title: 'Option 6', id: '3'},
                {title: 'Option 7', id: '4'},
                {title: 'Option 8', id: '5'},
                {title: 'Option 9', id: '6'},
            ]
        )
     ```

- Created new pipe to highlight search query. class `dropdown-item-highlight`
### Changes
- CreateNewAutocompleteGroup now accepts {id:string|number}, before only {id:string}
- Some small changes.
## [1.1.6] - 2017-07-12.
- KeyEvents now preventDefault
- Close dropdown on tab.
- Open dropdown on focus - was only on click.
- Updated README.md.

## [1.1.5] - 2017-07-12.
- Maintain active option when input is blurred - also for disabled completion inputs now.
- Updated README.md.

## [1.1.4] - 2017-07-12.
- Maintain active option when input is blurred.
- Updated README.md.

## [1.1.3] - 2017-07-12.
- Updated README.md.

## [1.1.2] - 2017-07-11.
- Fixed an issue; when selecting a option from a completer that is parent, active child option didn't reset.
- Updated README.md.

## [1.1.1] - 2017-07-11.
### New Functionality.
- SelectItem(key: string, id: string)
    - NgAutocompleteComponent function - Set value manual, by id. This can be useful when the list is loaded
    but there's a value set in the database. When the data is fetched from server, this method can be used.
    ```typescript
      @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
      this.completer.SelectItem('completer', '1');
    ```
    ### Or if multiple completers in component.
    
    ```typescript
      @ViewChildren(NgAutocompleteComponent) public completers: QueryList<NgAutocompleteComponent>;

      const completer = NgAutocompleteComponent.FindCompleter('group1', this.completers);
      completer.SelectItem('completer', '1');
    ```
    
## [1.0.1] - 2017-07-11.
- Only groups with parents did a reset when the input reached a length <= 0. Now all inputs do, input with parents still get set to initial value.

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

# NgAutocompleteComponent Functions

### Note:

<p>I have made all NgAutocompleteComponent and CompleterComponent functions public, so you could do a lot more than i'll show you<p>
<p>I've documented the functions of which i think their useful:<p>

### Usage
```typescript
@ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
```

| Function | Description |
| :---         |     :---:      |
| FindCompleter((key: string, list: QueryList<NgAutocompleteComponent>)) (Static function) | Finds completer |
| ResetInputs()   | Resets all rendered completer inputs |
| FindInput(key: string)     | Find completer input by assigned key |
| RemovableValues(key: string, list: {id: string or number, [value: string]: any}[]) | Remove options from rendered list (by id) |
| SelectItem(key: string, id: string or number) | e.g set an initial value on the completers input |
| SetValues(key: string, {id: string or number, [value: string]: any}[]) | Sets values for the input. Useful in async situations.|


# CompleterComponent Functions

### Usage
```typescript
@ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
public input = this.completer.FindInput('completer');
```

| Function | Description |
| :---         |     :---:      |
| ClearValue()   | Clears found completer's input. |

# Contributing

### Do you like to code?

- Fork & clone 
- npm install
- ng serve
- git checkout -b my-new-feature
- component lives in src/app/ng-autocomplete/*
- Submit a pull request

### Do you like organizing?
- Link to duplicate issues, and suggest new issue labels, to keep things organized
- Go through open issues and suggest closing old ones.
- Ask clarifying questions on recently opened issues to move the discussion forward
