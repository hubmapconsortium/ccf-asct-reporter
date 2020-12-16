import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RootComponent } from './modules/root/root.component';


const routes: Routes = [
  {
    path: 'vis',
    component: RootComponent
  },
  {
    path: 'vis/:sheet',
    component: RootComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
