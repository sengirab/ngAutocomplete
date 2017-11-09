import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgAutocompleteComponent } from './ng-autocomplete.component';
import { CompleterComponent } from './completer/completer.component';
import { NgDropdownDirective } from './dropdown/ng-dropdown.directive';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from './pipes/highlight';
import { KeyValuePipe } from './pipes/key-value';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        NgAutocompleteComponent,
        CompleterComponent
    ],
    declarations: [
        NgAutocompleteComponent,
        CompleterComponent,
        NgDropdownDirective,
        HighlightPipe,
        KeyValuePipe
    ]
})
export class NgAutoCompleteModule {
}
