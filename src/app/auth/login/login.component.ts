import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { EmpServiceService } from '../../employee/emp-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../../employee/delete-modal/delete-modal.component';

@Component({
  selector: 'app-login',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  empService = inject(EmpServiceService);
  router = inject(Router);
  dialog = inject(MatDialog);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Data:', formData);
      const payload = {
        username : formData.username ?? '',
        password : formData.password ?? ''
      }
      this.authService.login(payload).subscribe({
        next : (res) =>{
          if(res) {
            localStorage.setItem('accessToken',res.data.access_token)
            localStorage.setItem('refreshToken',res.data.refresh_token)
            localStorage.setItem('username',formData.username ?? '')
            this.empService.username.set(formData.username ?? '');
            this.router.navigate(['/app/home'])
          }
        }, 
        error : (err) => {
          console.log(err);
          
          this.dialog.open(DeleteModalComponent,{
            height : '150px',
            width : '450px',
            data: {
              title : err.error.message,
              isCancel : false,
              deleteButtonText : 'OK',
              timeout : 5000
            }
          })
        }
      })
      // Add your form submission logic here (e.g., authentication API call)
    } else {
      console.log('Form is invalid');
    }
  }
}
