import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpServiceService } from '../emp-service.service';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

interface Employee {
  name: string;
  position: string;
  email ?: string;
  id:string;
}


@Component({
  selector: 'app-emp-list',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [FormsModule,RouterLink],
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {
  dialog = inject(MatDialog);
  empService = inject(EmpServiceService);
  router = inject(Router);

  // employees: Employee[] = [
  //   { name: 'Alice Johnson', position: 'Software Engineer' },
  //   { name: 'Bob Smith', position: 'Project Manager' },
  //   { name: 'Carol White', position: 'Product Designer' },
  //   { name: 'David Brown', position: 'DevOps Engineer' }
  // ];
  employees = signal<Employee[] | undefined>(undefined);

  searchTerm = '';

  filteredEmployees(): Employee[] | undefined {
    return this.employees()?.filter(employee =>
      employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(this.searchTerm.toLowerCase())
    ) ;
  }

  ngOnInit() {
    this.empService.employeeList().subscribe({
      next : (res) => {
        console.log(res);
        this.employees.set(res.data.row_data)
        
      }
    })
  }

  view(id:string){
    this.router.navigate([`/app/detail/${id}`])
  }

  openProfileModal(): void {
    this.dialog.open(ProfileModalComponent, {
      width: '400px',
      height : 'auto'
    });
  }

}
