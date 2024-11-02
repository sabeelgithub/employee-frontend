import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { EmpServiceService } from '../emp-service.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  imports : [RouterLink],
  standalone : true,
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ProfileModalComponent>);
  router = inject(Router);
  empService = inject(EmpServiceService);
  ngOnInit() {
    const username = localStorage.getItem('username')
    if(username !== '' && username){
      this.empService.username.set(username);
    }
  }

  logout(): void {
    this.dialogRef.close();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  navigateToChange(){
    this.dialogRef.close();
    this.router.navigate(['/app/change-password'])
  }

}
