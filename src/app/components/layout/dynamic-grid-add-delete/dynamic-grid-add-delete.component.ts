import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
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
  containerSizeOptions: any[][] = [];

  @ViewChild(MatTable) table!: MatTable<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @Output() deleteRow = new EventEmitter<{ index: number; row: any }>();

  constructor(private fb: FormBuilder, private agentService: AgentService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });
    this.containerSizeOptions.push([]);
    this.subscribeToContainerSizeChanges(0);
    this.form.valueChanges.subscribe(() => {
      this.gridDataChange.emit(this.getGridData());
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      containerSize: [
        '',
        { validators: [Validators.required], updateOn: 'change' },
      ],
      noOfContainer: [
        '',
        { validators: [Validators.required], updateOn: 'change' },
      ],
      containerId: [''],
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
    const row = this.rows.at(index) as FormGroup;
    this.deleteRow.emit({ index, row: row.getRawValue() });
  }
  getGridData(): any[] {
    const allRows = this.rows.getRawValue();
    return allRows;
  }

  private subscribeToContainerSizeChanges(rowIndex: number): void {
    const row = this.rows.at(rowIndex);
    if (!row) return; // ✅ safety check

    row
      .get('containerSize')
      ?.valueChanges.pipe(
        debounceTime(300),
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
        this.containerSizeOptions[rowIndex] =
          res.Status === 'Success' ? res.GetContainerSize : [];
      });
  }

  onContainerSizeSelected(event: any, rowIndex: number): void {
    const selectedValue = event.option.value;
    this.rows.at(rowIndex).patchValue({
      containerSize: selectedValue,
    });
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  setGridRows(data: any[]): void {
    const rowsArray = this.fb.array<FormGroup>([]);
    this.clearFormArray(rowsArray);
    this.containerSizeOptions = [];

    if (!data || data.length === 0) {
      rowsArray.push(this.createRow());
      this.containerSizeOptions.push([]);
    } else {
      data.forEach((item) => {
        rowsArray.push(
          this.fb.group({
            containerId: [item.containerId || null],
            containerSize: [item.containerSize || '', Validators.required],
            noOfContainer: [item.noOfContainer || '', Validators.required],
          })
        );
        this.containerSizeOptions.push([]);
      });
    }

    this.form.setControl('rows', rowsArray);

    this.rows.controls.forEach((_, i) => {
      this.subscribeToContainerSizeChanges(i);
    });

    Promise.resolve().then(() => this.table?.renderRows());
  }

  clearGrid(): void {
    this.clearFormArray(this.rows);
    this.containerSizeOptions = [];
    this.rows.push(this.createRow());
    this.containerSizeOptions.push([]);
    this.subscribeToContainerSizeChanges(0);
    this.table.renderRows();
  }
}
