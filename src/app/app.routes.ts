import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path : '',
        redirectTo : 'auth',
        pathMatch : 'full'
    },
    {
        path : 'auth',
        canActivate : [LoginGuard],
        loadChildren: () => import('./auth/auth.route').then(m => m.AUTH_ROUTES) 
    },
    {
        path : 'app',
        canActivate : [AuthGuard],
        loadChildren: () => import('./employee/emp.route').then(m => m.EMP_ROUTES) 
    }
];
