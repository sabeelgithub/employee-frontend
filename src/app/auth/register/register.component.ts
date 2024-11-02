import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
  }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', []),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [this.passwordMatchValidator().bind(this),Validators.required])
  });

  // Custom validator for password matching
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get('password');
      const confirmPassword = control.root.get('confirmPassword');
      
      if (!password || !confirmPassword) {
        return null;
      }
      

      return password.value === confirmPassword.value 
        ? null 
        : { passwordMismatch: true };
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const payload = {
        email : formData.email ?? '',
        username : formData.username ?? '',
        phone : formData.phone ?? '',
        password : formData.password ?? ''
      }
      console.log('Registration Data:', formData);
      this.authService.register(payload).subscribe({
        next : (res) => {
          if(res){
            this.router.navigate(['/auth/login'])
          }
        }
      })
      // Add your form submission logic here (e.g., registration API call)
    } else {
      console.log('Form is invalid');
    }
  }

}
