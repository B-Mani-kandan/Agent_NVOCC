import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  selector: 'app-dynamic-gridview',
  templateUrl: './dynamic-gridview.component.html',
  styleUrl: './dynamic-gridview.component.css',
})
export class DynamicGridviewComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() rowSelected = new EventEmitter<{ action: string; data: any }>();
  @Input() tabName: string = '';
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayColumns: string[] = [];

  ngOnInit() {
    this.setupTable();
  }

  ngOnChanges() {
    this.setupTable();
  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewChecked() {
    if (this.dataSource && this.paginator && !this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  setupTable() {
    this.dataSource = new MatTableDataSource(this.data);

    if (this.columns.length) {
      this.displayColumns = ['select', ...this.columns];

      if (['INVOICE', 'CONTAINER', 'VESSEL'].includes(this.tabName)) {
        this.displayColumns.push('delete');
      }
    }

    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: any) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onSelect(row: any) {
    this.rowSelected.emit({ action: 'select', data: row });
  }

  onDelete(row: any) {
    this.rowSelected.emit({ action: 'delete', data: row });
  }

  refreshPage() {
    window.location.reload();
  }
}
