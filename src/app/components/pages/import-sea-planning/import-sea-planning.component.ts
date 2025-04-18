import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  IMP_GENERAL_FIELDS,
  IMP_INVOICE_FIELDS,
  IMP_OPERATION_FIELDS,
  IMP_BLIGM_FIELDS,
  IMP_VESSEL_FIELDS,
  IMP_CONTAINER_FIELDS,
} from './import-sea-input-fields.config';
import { IMP_AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-import-sea-planning',
  imports: [
    CommonModule,
    DynamicFormsComponent,
    // DynamicGridviewComponent,
    TabPanelComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './import-sea-planning.component.html',
  styleUrl: './import-sea-planning.component.css',
})
export class ImportSeaPlanningComponent implements OnInit {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  ModifyJobId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  InvoiceID: any | undefined;
  Imp_tabName: string = 'GENERAL';
  Imp_tabLabels: string[] = [
    'GENERAL',
    'OPERATION DETAILS',
    'BL/IGM DETAILS',
    'INVOICE DETAILS',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
  imp_GeneralForm!: FormGroup;
  imp_OperationForm!: FormGroup;
  imp_BligmForm!: FormGroup;
  imp_InvoiceForm!: FormGroup;
  imp_ContainerForm!: FormGroup;
  imp_VesselForm!: FormGroup;
  gridData: any[] = [];
  displayedColumns: string[] = [];
  imp_GeneralFields = IMP_GENERAL_FIELDS;
  imp_OperationFields = IMP_OPERATION_FIELDS;
  imp_BligmFields = IMP_BLIGM_FIELDS;
  imp_InvoiceFields = IMP_INVOICE_FIELDS;
  imp_ContainerFields = IMP_CONTAINER_FIELDS;
  imp_VesselFields = IMP_VESSEL_FIELDS;
  isModifyVisible: boolean = false;
  isoperModifyVisible: boolean = false;
  isInvoiceModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  isVesselModifyVisible: boolean = false;

  ngOnInit() {
    this.imp_GeneralForm = this.createForm(this.imp_GeneralFields);
    this.imp_OperationForm = this.createForm(this.imp_OperationFields);
    this.imp_BligmForm = this.createForm(this.imp_BligmFields);
    this.imp_InvoiceForm = this.createForm(this.imp_InvoiceFields);
    this.imp_ContainerForm = this.createForm(this.imp_ContainerFields);
    this.imp_VesselForm = this.createForm(this.imp_VesselFields);
    this.setupAutocompleteListeners();
    this.getJobNo();
    this.getCurrentDate();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.FinanceYear = '2024-2025';
    this.BranchID = '1594';
    this.fetchGridData('GENERAL');
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService
  ) {}

  @ViewChild('IMP_GENERAL', { static: false }) IMP_GENERAL!: TemplateRef<any>;
  @ViewChild('IMP_OPERATION', { static: false })
  IMP_OPERATION!: TemplateRef<any>;
  @ViewChild('IMP_BLIGM', { static: false })
  IMP_BLIGM!: TemplateRef<any>;
  @ViewChild('IMP_INVOICE', { static: false }) IMP_INVOICE!: TemplateRef<any>;
  @ViewChild('IMP_CONTAINER', { static: false })
  IMP_CONTAINER!: TemplateRef<any>;
  @ViewChild('IMP_VESSEL', { static: false }) IMP_VESSEL!: TemplateRef<any>;

  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.IMP_GENERAL &&
        this.IMP_OPERATION &&
        this.IMP_BLIGM &&
        this.IMP_INVOICE &&
        this.IMP_CONTAINER &&
        this.IMP_VESSEL
      ) {
        this.tabContents = [
          this.IMP_GENERAL,
          this.IMP_OPERATION,
          this.IMP_BLIGM,
          this.IMP_INVOICE,
          this.IMP_CONTAINER,
          this.IMP_VESSEL,
        ];
      } else {
      }
    }, 0);
  }
  saveForm(data: any) {}
  createForm(fields: any[]): FormGroup {
    let group: any = {};
    fields.forEach((field) => {
      group[field.id] = new FormControl('');
    });
    return new FormGroup(group);
  }
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [
        'Imp_gen_ClientName',
        'Imp_gen_Pol',
        'Imp_gen_Pod',
        'Imp_gen_Fpod',
        'Imp_gen_ItemDesc',
      ],
      INVOICE: ['Imp_inv_InvoiceNo', 'Imp_inv_InvoiceDate'],
      CONTAINER: ['Imp_cont_ContainerSize', 'Imp_cont_ContainerNo'],
      VESSEL: ['Imp_vess_VesselName'],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }

  getCurrentDate() {
    const today = new Date();
    this.imp_GeneralForm.patchValue({
      Imp_gen_JobDate: today.toISOString().split('T')[0],
    });
  }
  getJobNo(): void {
    const payload = {
      CompanyID: 'FST2223005',
      FinanceYear: '2024-2025',
      BranchID: '1594',
    };

    this.agentService.NVOCC_GetJobNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetJobNo?.length > 0) {
          const jobNo = res.GetJobNo[0]?.orderno;
          this.imp_GeneralForm.patchValue({
            Imp_gen_JobNo: jobNo,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Job No not found',
          });
        }
      },
      () => {}
    );
  }

  setupAutocompleteListeners() {
    IMP_AUTOCOMPLETE_FIELDS.forEach(
      ({ field, method, payloadType, formType }) => {
        const formGroup = (this as any)[formType];

        if (formGroup && formGroup.get(field)) {
          formGroup
            .get(field)
            ?.valueChanges.pipe(
              debounceTime(100),
              distinctUntilChanged(),
              switchMap((input: string) =>
                (this as any)[method](input, payloadType)
              )
            )
            .subscribe((options: any[]) => {
              (this as any)[`${field}Suggestions`] = options;
            });
        }
      }
    );
  }

  fetchClientSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetClientName',
      'ClientName',
      'AccountName',
      payloadType
    );
  }

  fetchShipperSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetShipperName',
      'ShipperName',
      'PartyName',
      payloadType
    );
  }

  fetchConsigneeSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetConsigneeName',
      'ConsigneeName',
      'consigneeName',
      payloadType
    );
  }

  fetchPortSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'Nvocc_GetPortCountry',
      'PortCountry',
      'PortName',
      payloadType
    );
  }

  fetchShippingLineSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'Nvocc_GetShippingLine',
      'ShippingLineName',
      'AccountName',
      payloadType
    );
  }

  fetchEmptyYardNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetYardName',
      'GetYardName',
      'AccountName',
      payloadType
    );
  }

  fetchInvCurrencySuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetCurrency',
      'GetCurrency',
      'ShortName',
      payloadType
    );
  }

  fetchInvTermsSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetTerms',
      'GetTerms',
      'Term',
      payloadType
    );
  }

  fetchInvTypePackgSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetTypeOfPackage',
      'GetTypeof_Package',
      'packageType',
      payloadType
    );
  }

  fetchInvUnitSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetUnitType',
      'GetUnitType',
      'UnitCode',
      payloadType
    );
  }

  fetchContSizeSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetContainerSize',
      'GetContainerSize',
      'CType',
      payloadType
    );
  }

  fetchVesselNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetVesselName',
      'GetVesselName',
      'VesselName',
      payloadType
    );
  }
  fetchData(
    input: string,
    serviceMethod: string,
    responseKey: string,
    itemKey: string,
    payloadType: string
  ): Observable<string[]> {
    if (!input) return of([]);

    //empty yard autocomplete pol value split and pass country
    let country = '';
    if (payloadType === 'EmptyYard') {
      const polValue = this.imp_GeneralForm?.get('Imp_gen_Pol')?.value || '';
      country = polValue;
    }

    const payloadMap: Record<string, any> = {
      InputVal: { InputVal: input },
      common: { InputVal: input, CompanyId: this.CompanyId },
      client: { InputVal: input, CompanyID: this.CompanyId, CompID: '1575' },
      forwarder: { InputVal: input, CompanyId: this.CompanyId },
      EmptyYard: {
        InputVal: input,
        CompanyId: this.CompanyId,
        Country: country,
      },
    };

    const requestPayload = payloadMap[payloadType] || { InputVal: input };

    return (this.agentService as any)[serviceMethod](requestPayload).pipe(
      map((response: any) =>
        response?.Status === 'Success' && Array.isArray(response[responseKey])
          ? response[responseKey].map((item: any) => item[itemKey])
          : []
      ),
      catchError((error: any) => {
        return of([]);
      })
    );
  }
  getAutocompleteOptions(fieldId: string): string[] {
    return (this as any)[`${fieldId}Suggestions`] || [];
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['JobNo', 'JobDate', 'ClientName', 'Shipper', 'Pol', 'Pod'],
      INVOICE: [
        'InvoiceNo',
        'InvoiceDate',
        'InvoiceValue',
        'Currency',
        'Terms',
      ],
      CONTAINER: ['ContainerNo', 'ContainerSize', 'LineSealNo'],
      VESSEL: ['POL', 'POD', 'VesselName', 'Etd', 'Eta'],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };

    if (this.Imp_tabName !== 'OPERATION') {
      this.agentService.fetchGridData(tab, payload).subscribe(
        (res: any) => {
          if (res.Status === 'Success') {
            const key = Object.keys(res).find((k) => k.startsWith('Show'))!;
            this.gridData = res[key];
            this.displayedColumns = columnMap[tab];
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
}
