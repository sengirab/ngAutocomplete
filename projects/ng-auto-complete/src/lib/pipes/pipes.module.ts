import { ModuleWithProviders, NgModule } from '@angular/core';
import { HighlightPipe } from './highlight';
import { KeyValuePipe } from './key-value';

@NgModule({
    imports     : [],
    declarations: [ HighlightPipe, KeyValuePipe ],
    exports     : [ HighlightPipe, KeyValuePipe ],
})
export class PipeModule {

    static forRoot(): ModuleWithProviders<PipeModule> {
        return {
            ngModule : PipeModule,
            providers: [],
        };
    }
}
