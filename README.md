# NgAutoComplete

![](https://raw.githubusercontent.com/sengirab/ng-autocomplete/master/demo.gif)

# Installation

`npm i ng-auto-complete --save`

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
import {CreateNewAutocompleteGroup, SelectedAutocompleteItem} from "ng-auto-complete";
import {NgAutocompleteComponent} from "ng-auto-complete/ng-autocomplete.component";

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
<ng-autocomplete (selected)="Selected($event)" [classes]="['']"
                     [group]="group"></ng-autocomplete>
```