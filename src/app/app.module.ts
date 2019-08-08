import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {NgAutoCompleteModule} from 'ng-auto-complete';
import {NgViewComponent} from './ng-view/ng-view.component';
import {NgHolderComponent} from './ng-holder/ng-holder.component';
import {AppRoutingModule} from './app-routing.module';
import {Route1Component} from './routes/route1/route1.component';
import {Route2Component} from './routes/route2/route2.component';

@NgModule({
    declarations: [
        AppComponent,
        NgViewComponent,
        NgHolderComponent,
        Route1Component,
        Route2Component
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        NgAutoCompleteModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
