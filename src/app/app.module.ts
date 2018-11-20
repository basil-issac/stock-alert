import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.gaurd';
import { UserResolver } from './user/user.resolver';
import { UserService } from './core/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashComponent } from './dash/dash.component';
import { HttpClientModule } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts';
import { AlertModule } from 'ngx-bootstrap';
import { ModalComponent } from './custom/modal/modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HistoryComponent } from './history/history.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    DashComponent,
    ModalComponent,
    HistoryComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    ChartsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    NgbModule.forRoot(),
    
  ],
  entryComponents: [ModalComponent],
  providers: [AuthService, UserService, AuthGuard, UserResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
