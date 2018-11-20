import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './core/auth.gaurd';
import { UserResolver } from './user/user.resolver';
import { DashComponent } from './dash/dash.component';
import { HistoryComponent } from './history/history.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent,  resolve: { data: UserResolver}},
  //{path: 'dash', component: DashComponent}
   { path: 'dash', component: DashComponent,  resolve: { data: UserResolver}},
   { path: 'history', component: HistoryComponent,  resolve: { data: UserResolver}}
];