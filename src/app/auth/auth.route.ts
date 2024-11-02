import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const AUTH_ROUTES: Routes = [
  {
    path : '',
    redirectTo : 'login',
    pathMatch : 'full'
  },
  {
    path : 'login',
    component : LoginComponent,
    pathMatch : 'full',
    data : {
      title : 'login'
    }
  },
  {
    path : 'register',
    component : RegisterComponent,
    pathMatch : 'full',
    data : {
      title : 'register'
    }
  }
];

