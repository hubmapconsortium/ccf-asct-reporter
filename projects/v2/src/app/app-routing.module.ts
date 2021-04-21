
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootComponent } from './modules/root/root.component';
import { HomeComponent } from './components/home/home.component';
import { DocsComponent } from './modules/docs/docs.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('././components/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'vis',
    component: RootComponent
  },
  {
    path: 'playground',
    component: RootComponent
  },
  {
    path: 'vis/:sheet/:version/:playground',
    component: RootComponent
  },
  {
    path: 'docs',
    component: DocsComponent
  },
  {
    path: 'docs/:id',
    component: DocsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
