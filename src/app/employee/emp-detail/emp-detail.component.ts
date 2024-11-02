import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EmpServiceService } from '../emp-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyValuePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-emp-detail',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [KeyValuePipe],
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css']
})
export class EmpDetailComponent implements OnInit {

  empService = inject(EmpServiceService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);
  employee = signal<any>(null);

  constructor() { }

  ngOnInit() {
    const empId = this.route.snapshot.paramMap.get('id');
    if (empId) {
      this.empService.employeeDetail(empId).subscribe({
        next : (res) => {
          console.log(res);
          this.employee.set(res.data);

          
        }
      })
    }
  }

  editEmployee(){
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/app/edit/${id}`])
  }

  deleteEmployee(){
    this.dialog.open(DeleteModalComponent,{
      data: {
        title: 'Are you sure you want to delete this employee?',
        confirmMessage: 'Do you really want to delete this item? This action cannot be undone.',
        cancelButtonText: 'No, Keep It',
        deleteButtonText: 'Yes, Delete',
      }
    }).afterClosed().subscribe({

      next : (res) => {
        if(res){
         this.deleteEmpApi();
        }
      }
    })
  }

  deleteEmpApi(){
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.empService.employeeDelete(id).subscribe({
      next : (res) => {
        if(res) {
          this.router.navigate(['/app/home'])
          this.dialog.open(DeleteModalComponent,{
            height : '150px',
            width : '450px',
            data: {
              title: 'Employee Deleted Succesfully',
              isCancel : false,
              deleteButtonText : 'OK',
              timeout : 1000
            }
          })
        }
      }
    })
  }

}
