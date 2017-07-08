import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NgAutocompleteComponent} from "./ng-autocomplete.component";
import {CompleterComponent} from "./completer/completer.component";
import {NgDropdownDirective} from "./dropdown/ng-dropdown.directive";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        NgAutocompleteComponent,
        CompleterComponent,
    ],
    declarations: [
        NgAutocompleteComponent,
        CompleterComponent,
        NgDropdownDirective,
    ]
})
export class NgAutoCompleteModule {
}
