import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-grid-add-delete',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-grid-add-delete.component.html',
  styleUrl: './dynamic-grid-add-delete.component.css',
})
export class DynamicGridAddDeleteComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
    this.addRow();
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      containerSize: [''],
      noOfContainer: [0],
      isSelected: [false],
    });
  }

  addRow() {
    this.rows.push(this.createRow());
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }
}
