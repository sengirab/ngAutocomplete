import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {NgAutoCompleteModule} from 'ng-auto-complete';
import {NgViewComponent} from './ng-view/ng-view.component';
import {NgHolderComponent} from './ng-holder/ng-holder.component';

@NgModule({
    declarations: [
        AppComponent,
        NgViewComponent,
        NgHolderComponent
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
