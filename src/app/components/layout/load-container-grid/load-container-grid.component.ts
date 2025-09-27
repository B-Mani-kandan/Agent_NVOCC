import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
@Component({
  selector: 'app-load-container-grid',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
  ],
  templateUrl: './load-container-grid.component.html',
  styleUrl: './load-container-grid.component.css',
})
export class LoadContainerGridComponent {
  displayedColumns: string[] = ['select', 'ContainerNo', 'ContainerType'];
  selection = new SelectionModel<any>(true, []);

  constructor(
    public dialogRef: MatDialogRef<LoadContainerGridComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {}

  toggleRow(row: any) {
    this.selection.toggle(row);
  }

  isAllSelected() {
    return this.selection.selected.length === this.data.length;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach((row) => this.selection.select(row));
  }

  onConfirm() {
    this.dialogRef.close(this.selection.selected);
  }
}
