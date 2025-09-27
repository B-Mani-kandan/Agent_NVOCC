import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { Observable } from 'rxjs';

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
export class DynamicGridAddDeleteComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() fields: any[] = [];
  @Input() initialRows: any[] = [];
  @Input() fetchMethod!: (
    method: string,
    input: string,
    payloadType: string
  ) => Observable<string[]>;

  @Input() HideAction: string = '';
  @Output() gridDataChange = new EventEmitter<any[]>();
  @Output() deleteRow = new EventEmitter<{ index: number; row: any }>();

  form!: FormGroup;
  displayedColumns: string[] = [];

  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.displayedColumns = [...this.fields.map((f) => f.id)];
    if (this.HideAction !== 'HIDEGRIDACTION') {
      this.displayedColumns.push('actions');
    }

    this.form = this.fb.group({
      rows: this.fb.array([this.createRow()]),
    });

    this.form.valueChanges.subscribe(() => {
      if (!this.isPatching) {
        this.gridDataChange.emit(this.getGridData());
      }
    });
  }

  // ngOnInit(): void {
  //   this.displayedColumns = [...this.fields.map((f) => f.id), 'actions'];
  //   this.form = this.fb.group({
  //     rows: this.fb.array([this.createRow()]),
  //   });

  //   this.form.valueChanges.subscribe(() => {
  //     if (!this.isPatching) {
  //       this.gridDataChange.emit(this.getGridData());
  //     }
  //   });
  // }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.refreshTable();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialRows'] && changes['initialRows'].currentValue) {
      this.setGridRows(changes['initialRows'].currentValue);
    }

    if (changes['HideAction']) {
      this.displayedColumns = [...this.fields.map((f) => f.id)];
      if (this.HideAction !== 'HIDEGRIDACTION') {
        this.displayedColumns.push('actions');
      }
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['initialRows'] && changes['initialRows'].currentValue) {
  //     this.setGridRows(changes['initialRows'].currentValue);
  //   }
  // }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(initialData: any = {}): FormGroup {
    const group: any = {};
    const idKey =
      Object.keys(initialData).find((k) =>
        /(FreightID|AnnexureID|ContainerID|ID)$/i.test(k)
      ) || 'ID';

    group[idKey] = [initialData[idKey] ?? null];
    this.fields.forEach((field) => {
      const validators: any[] = [];
      if (field.Validators?.includes('numbersOnly')) {
        validators.push(Validators.pattern(/^[0-9]*$/));
      }
      if (field.required) {
        validators.push(Validators.required);
      }

      const control = this.fb.control('', validators) as FormControl & {
        options: string[];
      };
      control.options = [];
      group[field.id] = control;

      if (field.type === 'autocomplete' && this.fetchMethod) {
        control.valueChanges
          .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter((input: string | null): input is string => !!input),
            switchMap((input: string) =>
              this.fetchMethod(field.method, input, field.payloadType)
            )
          )
          .subscribe((options: string[]) => {
            control.options = options;
          });
      }
    });

    return this.fb.group(group);
  }

  addRow(): void {
    this.rows.push(this.createRow());
    this.refreshTable();
  }

  removeRow(index: number): void {
    if (this.rows.length > 1) {
      const row = this.rows.at(index).value;
      this.deleteRow.emit({ index, row });
      this.rows.removeAt(index);
      this.refreshTable();
    }
  }

  getGridData(): any[] {
    return this.rows.getRawValue();
  }

  private isPatching = false;
  setGridRows(data: any[] = []): void {
    this.isPatching = true;
    const rowsArray = this.fb.array<FormGroup>([]);

    if (!data || data.length === 0) {
      rowsArray.push(this.createRow());
    } else {
      data.forEach((item) => {
        const rowGroup = this.createRow(item);
        this.fields.forEach((field) => {
          const candidates = [
            field.id,
            `common_${field.id}`,
            field.id.replace(/^common_/, ''),
            field.id.replace(/^common_/, '').toLowerCase(),
          ];
          let value = '';
          for (const k of candidates) {
            if (k && item.hasOwnProperty(k)) {
              value = item[k];
              break;
            }
          }
          rowGroup.get(field.id)?.setValue(value);
        });
        rowsArray.push(rowGroup);
      });
    }

    this.form.setControl('rows', rowsArray);

    setTimeout(() => {
      this.table?.renderRows();
      this.isPatching = false;
    });
  }

  clearGrid(): void {
    this.rows.clear();
    this.rows.push(this.createRow());
    this.refreshTable();
  }

  private refreshTable() {
    setTimeout(() => {
      if (this.table) {
        this.table.dataSource = this.rows.controls;
        this.table.renderRows();
      }
    }, 0);
  }
}
