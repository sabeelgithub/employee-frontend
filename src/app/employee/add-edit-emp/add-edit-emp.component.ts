import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpServiceService } from '../emp-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-emp',
  standalone : true,
  changeDetection : ChangeDetectionStrategy.OnPush,
  imports : [ReactiveFormsModule],
  templateUrl: './add-edit-emp.component.html',
  styleUrls: ['./add-edit-emp.component.css']
})
export class AddEditEmpComponent implements OnInit {
  dialog = inject(MatDialog);

employeeForm = new FormGroup({
  name: new FormControl('', Validators.required),
  position: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
  customFields: new FormArray([]) // Initialize FormArray for custom fields
});

  empService = inject(EmpServiceService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  isEditMode = signal<boolean>(false);
  employeeId: string | undefined = undefined;


  ngOnInit() {
    const routeData = this.route.snapshot.data['type'];
    if (routeData === 'edit') {
      const empId = this.route.snapshot.paramMap.get('id');
      this.isEditMode.set(true);
      this.loadEmployeeData(); // Load data if editing
    }
  }

   // Getter for custom fields FormArray
   get customFields(): FormArray {
    return this.employeeForm.get('customFields') as FormArray;
  }

  loadEmployeeData(): void {
    // Fetch the employee ID from route params if available
    const empId = this.route.snapshot.paramMap.get('id');
    if (empId) {
      this.empService.employeeDetail(empId).subscribe({
        next: (res) => {
          const employee = res.data;
          // Populate the form with fetched data
          this.employeeForm.patchValue({
            name: employee.name,
            position: employee.position,
            email: employee.email,
          });
          // Populate custom fields
          if (employee.custom_fields) {
            Object.entries(employee.custom_fields).forEach(([key, value]) => {
              const customFieldGroup = new FormGroup({
                key: new FormControl(key, Validators.required),
                value: new FormControl(value, Validators.required)
              });
              this.customFields.push(customFieldGroup);
            });
          }
        }
      });
    }
  }

  // Method to add a new custom field FormGroup
  addCustomField(): void {
    const customFieldGroup = new FormGroup({
      key: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    });
    this.customFields.push(customFieldGroup);
  }

  // Method to remove a custom field by index
  removeCustomField(index: number): void {
    this.customFields.removeAt(index);
  }

  // Form submit method
  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;
      console.log('Employee Data:', employeeData);
      const customFieldsObject: { [key: string]: any }  = {};
      this.customFields.controls.forEach((control) => {
        const key = control.get('key')?.value; // Get the key
        const value = control.get('value')?.value; // Get the value
        if (key) {
          customFieldsObject[key] = value; // Assign the key-value pair to the object
        }
      });
  
      const payload = {
        name: employeeData.name ?? '',
        email: employeeData.email ?? '',
        position: employeeData.position ?? '',
        custom_fields: customFieldsObject // Assign the custom fields object
      };
      const empId = this.route.snapshot.paramMap.get('id') ?? '';

      const saveRequest = this.isEditMode() ? this.empService.employeeUpdate(empId,payload) : this.empService.employeeCreate(payload);

      saveRequest.subscribe({
        next: (res) => {
          if (res) {
              this.dialog.open(DeleteModalComponent,{
                height : '150px',
                width : '450px',
                data: {
                  title: this.isEditMode() ? 'Employee Updated Succesfully' : 'Employee Added Succesfully',
                  isCancel : false,
                  deleteButtonText : 'OK',
                  timeout : 1000
                }
              })
            this.router.navigate(['/app/home']);
          }
        }
      });
  
      console.log('Payload to send:', payload);

      // Send `employeeData` to the server or perform other actions as needed
    } else {
      console.log('Form is not valid');
    }
  }

}
