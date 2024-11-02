import { Routes, RouterModule } from '@angular/router';
import { EmpListComponent } from './emp-list/emp-list.component';
import { AddEditEmpComponent } from './add-edit-emp/add-edit-emp.component';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

export const EMP_ROUTES: Routes = [
  {
    path : '',
    redirectTo : 'home',
    pathMatch : 'full'
  },
  {
    path : 'home',
    component : EmpListComponent,
    pathMatch : 'full',
    data : {
      title : 'Home'
    }
  },
  {
    path : 'add',
    component : AddEditEmpComponent,
    pathMatch : 'full',
    data : {
      title : 'Add',
      type : 'add'
    }
  },
  {
    path : 'edit/:id',
    component : AddEditEmpComponent,
    pathMatch : 'full',
    data : {
      title : 'Edit',
      type : 'edit'
    }
  },
  {
    path : 'detail/:id',
    component : EmpDetailComponent,
    pathMatch : 'full',
    data : {
      title : 'Detail'
    }
  },
  {
    path : 'change-password',
    component : ChangePasswordComponent,
    pathMatch : 'full',
    data : {
      title : 'Profile'
    }
  }
];