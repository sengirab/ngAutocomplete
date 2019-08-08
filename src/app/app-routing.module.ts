import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Route1Component} from './routes/route1/route1.component';
import {Route2Component} from './routes/route2/route2.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: Route1Component
            },
            {
                path: 'route2',
                component: Route2Component
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
