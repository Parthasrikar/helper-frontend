import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelperComponent } from './components/helper/helper.component';
import { HelperviewComponent } from './components/helper/helperview/helperview.component';
import { AddHelperComponent } from './components/helper/addhelper/addhelper.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/helpers/helperview',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'helpers',
        component: HelperComponent,
        children: [
          { path: '', redirectTo: 'helperview', pathMatch: 'full' },
          { path: 'helperview', component: HelperviewComponent },
          { path: 'addhelper', component: AddHelperComponent }
        ]
      },
      // other routes
      { path: 'fosts', component: HelperComponent },
      { path: 'helpdesk-setup', component: HelperComponent },
      { path: 'helpdesk-tickets', component: HelperComponent },
      { path: 'renovation-works', component: HelperComponent },
      { path: 'violation-setup', component: HelperComponent },
      { path: 'violation-tickets', component: HelperComponent },
      { path: 'amenities', component: HelperComponent },
      { path: 'roles-departments', component: HelperComponent },
      { path: 'staff-directory', component: HelperComponent },
      { path: 'assets', component: HelperComponent },
      { path: 'locations', component: HelperComponent },
      { path: 'work-packages', component: HelperComponent },
      { path: 'work-scheduler', component: HelperComponent },
      { path: 'work-logs', component: HelperComponent },
      { path: 'issues', component: HelperComponent }
    ]
  }
];

