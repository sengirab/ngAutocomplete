import {NgModule} from '@angular/core';
import {NgAutoCompleteComponent} from './ng-auto-complete.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CompleterComponent} from './completer/completer.component';
import {NgDropdownDirective} from './dropdown/ng-dropdown.directive';
import {PipeModule} from './pipes/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PipeModule.forRoot()
    ],
    exports: [
        NgAutoCompleteComponent,
        CompleterComponent,
    ],
    declarations: [
        NgAutoCompleteComponent,
        CompleterComponent,
        NgDropdownDirective
    ]
})
export class NgAutoCompleteModule {
}
