// import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatTable, MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-dynamic-grid-add-delete',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatTableModule,
//     MatInputModule,
//     MatIconModule,
//     MatButtonModule,
//   ],
//   templateUrl: './dynamic-grid-add-delete.component.html',
//   styleUrls: ['./dynamic-grid-add-delete.component.css'],
// })
// export class DynamicGridAddDeleteComponent implements OnInit {
//   form!: FormGroup;
//   displayedColumns: string[] = ['containerSize', 'noOfContainer', 'actions'];

//   @ViewChild(MatTable) table!: MatTable<any>;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       rows: this.fb.array([this.createRow()]),
//     });
//   }

//   get rows(): FormArray {
//     return this.form.get('rows') as FormArray;
//   }

//   createRow(): FormGroup {
//     return this.fb.group({
//       containerSize: ['', Validators.required],
//       noOfContainer: ['', Validators.required],
//     });
//   }

//   addRow(): void {
//     this.rows.push(this.createRow());
//     this.table.renderRows();
//   }

//   removeRow(index: number): void {
//     if (this.rows.length > 1) {
//       this.rows.removeAt(index);
//       this.table.renderRows();
//     }
//   }
// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AgentService } from '../../../services/agent.service'; // adjust path

@Component({
  selector: 'app-dynamic-grid-add-delete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './dynamic-grid-add-delete.component.html',
  styleUrls: ['./dynamic-grid-add-delete.component.css'],
})
export class DynamicGridAddDeleteComponent implements OnInit {
  form!: FormGroup;
  displayedColumns: string[] = ['containerSize', 'noOfContainer', 'actions'];

  // store autocomplete options for each row
  containerSizeOptions: any[][] = [];

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private fb: FormBuilder, private agentService: AgentService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });

    // initialize options for first row
    this.containerSizeOptions.push([]);
    this.subscribeToContainerSizeChanges(0);
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      containerSize: ['', Validators.required],
      noOfContainer: ['', Validators.required],
    });
  }

  addRow(): void {
    this.rows.push(this.createRow());
    const rowIndex = this.rows.length - 1;
    this.containerSizeOptions.push([]);
    this.subscribeToContainerSizeChanges(rowIndex);
    this.table.renderRows();
  }

  removeRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
      this.containerSizeOptions.splice(index, 1);
      this.table.renderRows();
    }
  }

  private subscribeToContainerSizeChanges(rowIndex: number): void {
    this.rows
      .at(rowIndex)
      .get('containerSize')
      ?.valueChanges.pipe(
        debounceTime(300), // wait for 300ms pause in typing
        switchMap((value: string) => {
          if (value && value.trim() !== '') {
            return this.agentService.NVOCC_GetContainerSize({
              InputVal: value,
            });
          }
          return of({ Status: 'Failed', GetContainerSize: [] });
        })
      )
      .subscribe((res: any) => {
        if (res.Status === 'Success') {
          this.containerSizeOptions[rowIndex] = res.GetContainerSize;
          console.log(this.containerSizeOptions);
        } else {
          this.containerSizeOptions[rowIndex] = [];
        }
      });
  }

  onContainerSizeSelected(event: any, rowIndex: number): void {
    const selectedValue = event.option.value;
    console.log(selectedValue);
    this.rows.at(rowIndex).get('containerSize')?.setValue(selectedValue);
  }
}
