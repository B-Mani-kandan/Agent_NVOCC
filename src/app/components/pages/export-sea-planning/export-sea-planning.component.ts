import {
  Component,
  ViewChild,
  Output,
  OnInit,
  TemplateRef,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
import { AgentService } from '../../../services/agent.service';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import { DynamicGridAddDeleteComponent } from '../../layout/dynamic-grid-add-delete/dynamic-grid-add-delete.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import {
  GENERAL_FIELDS,
  OPERATION_FIELDS,
  INVOICE_FIELDS,
  CONTAINER_FIELDS,
  VESSEL_FIELDS,
} from './export-sea-input-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-export-sea-planning',
  standalone: true,
  imports: [
    CommonModule,
    TabPanelComponent,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    DynamicGridAddDeleteComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './export-sea-planning.component.html',
  styleUrl: './export-sea-planning.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ExportSeaPlanningComponent implements OnInit {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  ModifyJobId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  InvoiceID: any | undefined;
  latestGridData: any[] = [];
  ContainerGridDetailsID: any | undefined;
  tabName: string = 'GENERAL';
  tabLabels: string[] = [
    'GENERAL',
    'OPERATION DETAILS',
    'INVOICE DETAILS',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
  disabledTabs: boolean[] = [false, true, true, true, true];
  generalForm!: FormGroup;
  operationForm!: FormGroup;
  invoiceForm!: FormGroup;
  containerForm!: FormGroup;
  vesselForm!: FormGroup;
  gridData: any[] = [];
  gridContainerData: any[] = [];
  displayedColumns: string[] = [];
  isModifyVisible: boolean = false;
  isoperModifyVisible: boolean = false;
  isInvoiceModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  isVesselModifyVisible: boolean = false;
  isGridVisible: boolean = false;
  searchClicked: boolean = false;
  fullGridData: string[] = [];
  selectedColumns: string[] = [];
  generalFields = GENERAL_FIELDS;
  operationFields = OPERATION_FIELDS;
  invoiceFields = INVOICE_FIELDS;
  containerFields = CONTAINER_FIELDS;
  vesselFields = VESSEL_FIELDS;

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @ViewChild('OPERATION', { static: false }) OPERATION!: TemplateRef<any>;
  @ViewChild('INVOICE', { static: false }) INVOICE!: TemplateRef<any>;
  @ViewChild('CONTAINER', { static: false }) CONTAINER!: TemplateRef<any>;
  @ViewChild('VESSEL', { static: false }) VESSEL!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @ViewChild('gridComp') gridComp!: DynamicGridAddDeleteComponent;

  getGridData(): any[] {
    return this.latestGridData;
  }

  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.generalForm = this.createForm(this.generalFields);
    this.operationForm = this.createForm(this.operationFields);
    this.invoiceForm = this.createForm(this.invoiceFields);
    this.containerForm = this.createForm(this.containerFields);
    this.vesselForm = this.createForm(this.vesselFields);
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.FinanceYear = '2025-2026';
    this.BranchID = '1594';
    this.setupAutocompleteListeners();
    this.getJobNo();
    this.getCurrentDate();
    this.onTabChange(0);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.GENERAL &&
        this.OPERATION &&
        this.INVOICE &&
        this.CONTAINER &&
        this.VESSEL
      ) {
        this.tabContents = [
          this.GENERAL,
          this.OPERATION,
          this.INVOICE,
          this.CONTAINER,
          this.VESSEL,
        ];
      } else {
      }
    }, 0);
    if (this.gridComp) {
      this.gridComp.setGridRows(this.gridContainerData);
    }
  }
  createForm(fields: any[]): FormGroup {
    let group: any = {};
    fields.forEach((field) => {
      group[field.id] = new FormControl('');
    });
    return new FormGroup(group);
  }

  saveForm(data: any) {}
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [
        'gen_ClientName',
        'gen_Pol',
        'gen_Pod',
        'gen_Fpod',
        'gen_ItemDesc',
      ],
      INVOICE: ['inv_InvoiceNo', 'inv_InvoiceDate'],
      CONTAINER: ['cont_ContainerSize', 'cont_ContainerNo'],
      VESSEL: ['vess_VesselName'],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }

  getCurrentDate() {
    const today = new Date();
    this.generalForm.patchValue({
      gen_JobDate: today.toISOString().split('T')[0],
    });
  }
  getJobNo(): void {
    const payload = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.agentService.NVOCC_GetJobNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetJobNo?.length > 0) {
          const jobNo = res.GetJobNo[0]?.orderno;
          this.generalForm.patchValue({
            gen_JobNo: jobNo,
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
    AUTOCOMPLETE_FIELDS.forEach(({ field, method, payloadType, formType }) => {
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
    });
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

  fetchContNoSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetContinerNo',
      'GetContainerNo',
      'ContainerNo',
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
    let EmptyyardValue = '';
    let Contsize = '';
    if (payloadType === 'EmptyYard') {
      const polValue = this.generalForm?.get('gen_Pol')?.value || '';
      country = polValue;
    } else if (payloadType === 'ContainerNo') {
      const Empty = this.generalForm?.get('gen_EmptyName')?.value;
      const contsize = this.generalForm?.get('cont_ContainerSize')?.value;
      EmptyyardValue = Empty;
      Contsize = contsize;
      if (Contsize == '' || Contsize == null) {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Please Enter Container Size',
        });
      }
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
      ContainerNo: {
        InputVal: input,
        CompanyID: this.CompanyId,
        EmptyYard: EmptyyardValue,
        ContainerSize: Contsize,
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

  loadContainerSizes(): void {
    let payload: any;

    payload = { CompanyId: this.CompanyId, JobID: this.ModifyJobId };

    this.agentService.NVOCC_GetContainer_ContainerSize(payload).subscribe({
      next: (res: any) => {
        if (
          res?.Status === 'Success' &&
          Array.isArray(res.GetContainer_ContainerSize)
        ) {
          const options = res.GetContainer_ContainerSize.map(
            (item: any) => item.CDescription
          );

          const containerSizeField = this.containerFields.find(
            (f) => f.id === 'cont_ContainerSize'
          );
          if (containerSizeField) {
            containerSizeField.options = options;
          }
        }
      },
    });
  }

  // Validations
  validateMandatoryFields(formGroup: FormGroup, templateId: string): boolean {
    const isMandatory = this.getMandatoryFields(templateId);
    let allValid = true;

    Object.keys(formGroup.controls).forEach((fieldId) => {
      if (isMandatory(fieldId)) {
        const control = formGroup.get(fieldId);
        if (!control?.value || control.value.toString().trim() === '') {
          control?.markAsTouched();
          allValid = false;
        }
      }
    });

    if (!allValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mandatory',
        detail: 'Please Fill mandatory Fields',
      });
    }

    return allValid;
  }

  private buildPayload(form: FormGroup, extraData: any = {}): any {
    return {
      ...form.getRawValue(),
      ...extraData,
    };
  }
  //  Save all Forms
  private saveSection(
    form: FormGroup,
    apiCall: (payload: any) => Observable<any>,
    extraData: any = {},
    onSuccess?: (res: any) => void
  ): void {
    if (form.invalid) {
      return;
    }

    const payload = this.buildPayload(form, extraData);

    apiCall(payload).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.capitalize(this.tabName)} ${res.Message}`,
          });
          onSuccess?.(res);
          this.fetchGridData(this.tabName);
          this.fetchContainerGridData();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: res.Message,
          });
        }
      },
      error: () => {},
    });
  }

  OnGeneralSave(callback?: () => void): void {
    if (!this.validateMandatoryFields(this.generalForm, 'GENERAL')) return;

    const data = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
      Nvocc_AgentID: localStorage.getItem('AgentID'),
      JobID: this.ModifyJobId,
    };

    this.saveSection(
      this.generalForm,
      this.agentService.NVOCC_Save_ExportSea_General.bind(this.agentService),
      data,
      (res) => {
        this.ModifyJobId = res.ReturnJobID;
        this.disabledTabs = [false, false, false, false, false];

        this.isModifyVisible = true;
        this.vesselForm.patchValue({
          vess_POL: this.generalForm?.get('gen_Pol')?.value || '',
          vess_POD: this.generalForm?.get('gen_Pod')?.value || '',
        });

        if (callback) callback();
      }
    );
  }

  OnContGridDetailsSave(): void {
    if (!this.latestGridData || this.latestGridData.length === 0) return;

    const payload = {
      ContainerDetails: this.latestGridData.map((row: any) => ({
        JobID: this.ModifyJobId,
        ContainerID: row.containerId,
        CompanyID: this.CompanyId,
        ContainerType: row.containerSize,
        NoOfContainer: row.noOfContainer,
      })),
    };
    this.agentService
      .NVOCC_Save_ExportSea_GridContainerDetails(payload)
      .subscribe();
  }

  OnOperationsSave(): void {
    const data = {
      CompanyID: this.CompanyId,
      SavedJobID: this.ModifyJobId,
    };

    this.saveSection(
      this.operationForm,
      this.agentService.NVOCC_Save_ExportSea_OperationDetails.bind(
        this.agentService
      ),
      data
    );
  }

  OnInvoiceSave(action: any): void {
    if (!this.validateMandatoryFields(this.invoiceForm, 'INVOICE')) return;

    const data = {
      SavedJobID: this.ModifyJobId,
      InvoiceID: action === 'Modify' ? this.InvoiceID : '',
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.saveSection(
      this.invoiceForm,
      this.agentService.NVOCC_Save_ExportSea_InvoiceDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearInvoiceForm();
  }

  OnContainerSave(action: any): void {
    if (!this.validateMandatoryFields(this.containerForm, 'CONTAINER')) return;
    const genEmptyName = this.generalForm.get('gen_EmptyName')?.value;
    const data = {
      SavedJobID: this.ModifyJobId,
      ContainerID: action === 'Modify' ? this.ContainerID : '',
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
      gen_EmptyName: genEmptyName,
    };
    this.saveSection(
      this.containerForm,
      this.agentService.NVOCC_Save_ExportSea_ContainerDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearContainerForm();
  }

  OnVesselSave(action: any): void {
    if (!this.validateMandatoryFields(this.vesselForm, 'VESSEL')) return;
    const data = {
      SavedJobID: this.ModifyJobId,
      VesselID: action === 'Modify' ? this.VesselID : '',
    };
    this.saveSection(
      this.vesselForm,
      this.agentService.NVOCC_Save_ExportSea_VesselDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearVesselForm();
  }

  onSave() {
    this.OnGeneralSave(() => {
      this.OnContGridDetailsSave();
    });
  }

  //Search Details

  onSearch() {
    if (this.tabName === 'GENERAL') {
      this.isGridVisible = true;
      this.searchClicked = true;
    }
    this.fetchGridData(this.tabName);
  }
  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.ModifyJobId = event.data.ID;
      this.fillGeneralForm(event.data);
    } else if (event.action === 'delete') {
      this.onRowDelete(event.data);
    }
  }
  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['select', 'JobNo', 'JobDate', 'Shipper', 'Pol', 'Pod'],
      INVOICE: [
        'select',
        'InvoiceNo',
        'InvoiceDate',
        'InvoiceValue',
        'Currency',
        'Terms',
        'delete',
      ],
      CONTAINER: [
        'select',
        'ContainerNo',
        'ContainerSize',
        'LineSealNo',
        'delete',
      ],
      VESSEL: ['select', 'POL', 'POD', 'VesselName', 'Eta', 'Etd', 'delete'],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };

    if (this.tabName !== 'OPERATION') {
      this.agentService.fetchGridData(tab, payload).subscribe(
        (res: any) => {
          if (res.Status === 'Success') {
            const key = Object.keys(res).find((k) => k.startsWith('Show'))!;
            this.gridData = res[key];
            this.displayedColumns = columnMap[tab];
          } else {
            this.gridData = [];
            this.displayedColumns = columnMap[tab];
          }
        },
        (error) => {
          console.error('API Error:', error);
          this.gridData = [];
          this.displayedColumns = [];
          this.isGridVisible = false;
        }
      );
    }
  }

  fetchContainerGridData() {
    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
    };

    if (this.tabName === 'GENERAL') {
      this.agentService
        .fetchContainerGridAddDeleteData(payload)
        .subscribe((res: any) => {
          if (res.Status === 'Success') {
            this.gridContainerData = res.ContainerDetails || [];
            if (this.gridComp) {
              this.gridComp.setGridRows(res.ShowGridContainerDetails);
            }
          }
        });
    }
  }

  onTabChange(tabIndex: number): void {
    this.tabName = this.tabLabels[tabIndex];
    if (this.searchClicked && this.tabName !== 'GENERAL') {
      this.isGridVisible = true;
    } else {
      this.isGridVisible = false;
    }
    switch (this.tabName) {
      case 'GENERAL':
        this.tabName = 'GENERAL';
        this.gridData = [];
        break;
      case 'OPERATION DETAILS':
        this.tabName = 'OPERATION';
        this.isGridVisible = false;
        this.gridData = [];
        break;
      case 'INVOICE DETAILS':
        this.tabName = 'INVOICE';
        this.isGridVisible = true;
        break;
      case 'CONTAINER DETAILS':
        this.tabName = 'CONTAINER';
        this.isGridVisible = true;
        this.loadContainerSizes();
        break;
      case 'VESSEL DETAILS':
        this.tabName = 'VESSEL';
        this.isGridVisible = true;
        break;
      default:
        this.tabName = this.tabName;
        return;
    }
    this.fetchGridData(this.tabName);
  }

  // Populate fields

  fillGeneralForm(row: any) {
    this.isModifyVisible = true;
    this.isoperModifyVisible = true;
    this.isGridVisible = false;
    this.disabledTabs = [false, false, false, false, false];
    this.ModifyJobId = row.ID || null;

    if (this.tabName === 'INVOICE') {
      this.InvoiceID = row.InvoiceID || null;
      this.isInvoiceModifyVisible = true;
      this.isGridVisible = true;
    } else if (this.tabName === 'CONTAINER') {
      this.ContainerID = row.ContID || null;
      this.isContModifyVisible = true;
      this.isGridVisible = true;
    } else if (this.tabName === 'VESSEL') {
      this.VesselID = row.VesselID || null;
      this.isVesselModifyVisible = true;
      this.isGridVisible = true;
    }

    const formValues: any = {};
    const operationFormValues: any = {};
    const invoiceFormValues: any = {};
    const containerFormValues: any = {};
    const vesselFormValues: any = {};

    const gendateFields = ['JobDate', 'HblDate', 'MblDate'];
    this.generalFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractGeneralRowKey(fieldId);
      formValues[fieldId] =
        gendateFields.includes(key) && row[key]
          ? this.convertToDateInputFormat(row[key])
          : row[key] ?? '';
    });

    this.operationFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractOperationRowKey(fieldId);

      if (key === 'SomeDateField' && row[key]) {
        operationFormValues[fieldId] = this.convertToDateInputFormat(row[key]);
      } else {
        operationFormValues[fieldId] = row[key] ?? '';
      }
    });

    this.invoiceFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractInvoiceRowKey(fieldId);
      invoiceFormValues[fieldId] =
        key === 'InvoiceDate' && row[key]
          ? this.convertToDateInputFormat(row[key])
          : row[key] ?? '';
    });

    this.containerFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractContainerRowKey(fieldId);
      containerFormValues[fieldId] = row[key] ?? '';
    });

    const dateFields = ['Etd', 'Eta'];
    this.vesselFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractVesselRowKey(fieldId);
      vesselFormValues[fieldId] =
        dateFields.includes(key) && row[key]
          ? this.convertToDateInputFormat(row[key])
          : row[key] ?? '';
    });

    this.generalForm.patchValue(formValues);
    this.operationForm.patchValue(operationFormValues);
    this.invoiceForm.patchValue(invoiceFormValues);
    this.containerForm.patchValue(containerFormValues);
    this.vesselForm.patchValue(vesselFormValues);
    if (this.ModifyJobId) {
      this.fetchContainerGridData();
    }
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^gen_/, '');
  }

  extractOperationRowKey(fieldId: string): string {
    return fieldId.replace(/^Oper_/, '');
  }

  extractInvoiceRowKey(fieldId: string): string {
    return fieldId.replace(/^inv_/, '');
  }

  extractContainerRowKey(fieldId: string): string {
    return fieldId.replace(/^cont_/, '');
  }

  extractVesselRowKey(fieldId: string): string {
    return fieldId.replace(/^vess_/, '');
  }

  convertToDateInputFormat(dateStr: string): string {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  //Delete
  onRowDelete(row: any): void {
    const jobId = row.ID;
    let apiUrl = '';
    let body: any = { JobID: jobId, CompanyID: this.CompanyId };
    let deleteKey = '';

    if (this.tabName === 'INVOICE') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteInvoice.ashx';
      body.InvoiceID = row.InvoiceID;
      deleteKey = 'InvoiceID';
    } else if (this.tabName === 'CONTAINER') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteContainer.ashx';
      body.ContainerID = row.ContID;
      deleteKey = 'ContID';
    } else if (this.tabName === 'VESSEL') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteVessel.ashx';
      body.VesselID = row.VesselID;
      deleteKey = 'VesselID';
    } else {
      return;
    }

    this.http.post(apiUrl, body).subscribe((res: any) => {
      if (res.Status === 'Sucess') {
        // Remove deleted row index id
        this.gridData = this.gridData.filter(
          (item: any) => item[deleteKey] !== row[deleteKey]
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.capitalize(this.tabName)} ${res.Message}`,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: res.Message,
        });
      }
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  onDeleteRow(event: { index: number; row: any }) {
    const { index, row } = event;

    if (row.containerId) {
      const payload = {
        ContainerID: row.containerId,
        JobID: this.ModifyJobId || '',
        CompanyID: this.CompanyId,
      };

      this.agentService
        .NVOCC_Delete_ExportSea_GridContainerDetails(payload)
        .subscribe((res: any) => {
          if (res.Status === 'Sucess') {
            this.gridComp.rows.removeAt(index);
            this.gridComp.containerSizeOptions.splice(index, 1);
            this.gridComp.table.renderRows();
          }
        });
    } else {
      if (this.gridComp.rows.length > 1) {
        this.gridComp.rows.removeAt(index);
        this.gridComp.containerSizeOptions.splice(index, 1);
        this.gridComp.table.renderRows();
      }
    }
  }

  //Clear Forms

  ClearAllForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.generalForm,
      invoiceForm: this.invoiceForm,
      operationForm: this.operationForm,
      containerForm: this.containerForm,
      vesselForm: this.vesselForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.gridComp.clearGrid();
    this.ModifyJobId = '';
    this.InvoiceID = '';
    this.ContainerID = '';
    this.VesselID = '';
    this.isModifyVisible = false;
    this.disabledTabs = [false, true, true, true, true];
    this.getJobNo();
    this.getCurrentDate();
  }

  ClearInvoiceForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      invoiceForm: this.invoiceForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.InvoiceID = '';
    this.isInvoiceModifyVisible = false;
  }

  ClearContainerForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      containerForm: this.containerForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.ContainerID = '';
    this.isContModifyVisible = false;
  }

  ClearVesselForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      vesselForm: this.vesselForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.VesselID = '';
    this.isVesselModifyVisible = false;
  }
}
