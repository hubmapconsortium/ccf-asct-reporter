import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VisComponent } from './vis/vis.component';
const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'vis', component: VisComponent
    }
];
@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
