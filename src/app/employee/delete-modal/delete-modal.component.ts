import { Component, inject, input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {
  private dialogData = inject(MAT_DIALOG_DATA);
  
  // Initialize inputs with dialog data
  title = this.dialogData.title || '';
  confirmMessage = this.dialogData.confirmMessage || '';
  cancelButtonText = this.dialogData.cancelButtonText || 'Cancel';
  deleteButtonText = this.dialogData.deleteButtonText || 'Delete';
  isCancel = this.dialogData.isCancel ?? true;
  dialogRef = inject(MatDialogRef<DeleteModalComponent>)
  ngOnInit() {
    if(this.dialogData.timeout){
      setTimeout(() => {
        this.dialogRef.close();
      }, this.dialogData.timeout);
    }
  }

  confirmDelete(): void {
    this.dialogRef.close(true);
  }

  // Cancel and close the modal
  cancel(): void {
    this.dialogRef.close(false);
  }
}
