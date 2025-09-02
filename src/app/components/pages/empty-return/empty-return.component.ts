import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AgentService } from '../../../services/agent.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-empty-return',
  imports: [CommonModule, DynamicGridviewComponent, ToastModule],
  providers: [MessageService],
  templateUrl: './empty-return.component.html',
  styleUrl: './empty-return.component.css',
})
export class EmptyReturnComponent implements OnInit {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  AgentID: any | undefined;
  ModifyJobId: any | undefined;

  gridData: any[] = [];
  displayedColumns: string[] = [];

  importfirstGridVisible: boolean = true;

  ngOnInit() {
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.FinanceYear = '2025-2026';
    this.BranchID = '1594';
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.fetchGridData('GENERAL');
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  HandleRowActionFirstGrid(event: { action: string; data: any }) {
    //this.fillGeneralForm(event.data);
    this.importfirstGridVisible = false;
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: [
        'select',
        'OrderJobNo',
        'OrderJobDate',
        'ClientName',
        'POL',
        'POD',
        'FPOD',
        'ShippingLine',
        'Nvocc',
      ],
    };

    const payload = {
      CompanyID: this.CompanyId,
      NvoccAgentID: this.AgentID,
    };

    this.agentService.Nvocc_ContainerBooking(tab, payload).subscribe(
      (res: any) => {
        if (res.Status === 'Success') {
          const key = Object.keys(res).find((k) => k.startsWith('Show'))!;
          this.gridData = res[key];
          this.displayedColumns = columnMap[tab];
          console.log('Grid Data:', this.gridData);
          console.log('Displayed Columns:', this.displayedColumns);
        } else {
          this.gridData = [];
          this.displayedColumns = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.gridData = [];
        this.displayedColumns = [];
        //this.isGridVisible = false;
      }
    );
  }
}
