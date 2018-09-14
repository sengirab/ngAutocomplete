import {NgModule} from '@angular/core';
import {NgAutoCompleteComponent} from './ng-auto-complete.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CompleterComponent} from './completer/completer.component';
import {NgDropdownDirective} from './dropdown/ng-dropdown.directive';
import {HighlightPipe} from './pipes/highlight';
import {KeyValuePipe} from './pipes/key-value';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        NgAutoCompleteComponent,
        CompleterComponent
    ],
    declarations: [
        NgAutoCompleteComponent,
        CompleterComponent,
        NgDropdownDirective,
        HighlightPipe,
        KeyValuePipe
    ]
})
export class NgAutoCompleteModule {
}
