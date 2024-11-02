import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-password',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [ReactiveFormsModule,NgIf],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  authService = inject(AuthService);
  dialog = inject(MatDialog);

  isLoading = signal<boolean>(false);
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [Validators.required,Validators.minLength(6)]),
    confirmPassword: new FormControl('',  [this.passwordMatchValidator().bind(this),Validators.required]),
  }); 
  ngOnInit() {
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get('newPassword');
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
    console.log(this.passwordForm.valid);
    
    if (this.passwordForm.valid) {
      this.isLoading.set(true);
      // Perform the change password operation
      console.log('Form Submitted!', this.passwordForm.value);
      const passwordValue = this.passwordForm.value
      const payload = {
        current_password : passwordValue.currentPassword,
        new_password : passwordValue.newPassword
      }

      this.authService.changePassword(payload).pipe(
        finalize(() =>{
          this.isLoading.set(false);
        })
      ).subscribe({
        next : (res) => {
          this.dialog.open(DeleteModalComponent,{
           
            data: {
              title:'Password Updated Succesfully',
              isCancel : false,
              deleteButtonText : 'OK',
              timeout : 1000
            }
          })
        },
        error : (err:any) => {
          console.log(err);
          
          this.dialog.open(DeleteModalComponent,{
          
            data: {
              title: err.error.message,
              isCancel : false,
              deleteButtonText : 'OK',
              timeout : 1000
            }
          })
        }
      })
    }
  }

}
