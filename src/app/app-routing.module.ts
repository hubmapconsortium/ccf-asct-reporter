import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VisComponent } from './vis/vis.component';
import { NotfoundComponent } from './notfound/notfound.component'
const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'vis',
        component: VisComponent
    },
    {
        path: 'vis/:sheet/:dataVersion',
        component: VisComponent
    },
    {
        path: 'error',
        component: NotfoundComponent
    },
    {
        path: '**',
        redirectTo: '/error'
    }
];
@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
