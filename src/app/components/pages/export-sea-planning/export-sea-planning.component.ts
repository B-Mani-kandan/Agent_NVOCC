import {
  Component,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
import { AgentService } from '../../../services/agent.service';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastComponent } from '../../layout/toast/toast.component';
import { ToastService } from '../../../services/toast.service';
import { AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import {
  GENERAL_FIELDS,
  OPERATION_FIELDS,
  INVOICE_FIELDS,
  CONTAINER_FIELDS,
  VESSEL_FIELDS,
} from './export-sea-input-fields.config';
@Component({
  selector: 'app-export-sea-planning',
  standalone: true,
  imports: [
    CommonModule,
    TabPanelComponent,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastComponent,
  ],
  templateUrl: './export-sea-planning.component.html',
  styleUrl: './export-sea-planning.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ExportSeaPlanningComponent {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  ModifyJobId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  InvoiceID: any | undefined;
  tabName: string = 'GENERAL';
  tabLabels: string[] = [
    'GENERAL',
    'OPERATION DETAILS',
    'INVOICE DETAILS',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
  disabledTabs: boolean[] = [false, false, false, false, false];
  generalForm!: FormGroup;
  operationForm!: FormGroup;
  invoiceForm!: FormGroup;
  containerForm!: FormGroup;
  vesselForm!: FormGroup;
  clientSuggestions: string[] = [];
  shipperSuggestions: string[] = [];
  consigneeSuggestions: string[] = [];
  polSuggestions: string[] = [];
  podSuggestions: string[] = [];
  fpodSuggestions: string[] = [];
  cfsNameSuggestions: string[] = [];
  chaNameSuggestions: string[] = [];
  coLoaderSuggestions: string[] = [];
  forwarderSuggestions: string[] = [];
  shippingLineSuggestions: string[] = [];
  emptyYardSuggestions: string[] = [];
  gridData: any[] = [];
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

  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.generalForm = this.createForm(this.generalFields);
    this.operationForm = this.createForm(this.operationFields);
    this.invoiceForm = this.createForm(this.invoiceFields);
    this.containerForm = this.createForm(this.containerFields);
    this.vesselForm = this.createForm(this.vesselFields);
    this.setupAutocompleteListeners();
    this.getJobNo();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.FinanceYear = '2024-2025';
    this.BranchID = '1594';
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
        console.error('One or more @ViewChild references are undefined!');
      }
    }, 0);
  }
  createForm(fields: any[]): FormGroup {
    let group: any = {};
    fields.forEach((field) => {
      group[field.id] = new FormControl('');
    });
    return new FormGroup(group);
  }

  saveForm(data: any) {
    console.log(data);
  }
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [
        'gen_ClientName',
        'gen_Pol',
        'gen_Pod',
        'gen_Fpod',
        'gen_ItemDesc',
      ],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
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
          this.generalForm.patchValue({
            gen_JobNo: jobNo,
          });
        } else {
          console.warn('Job No not found');
        }
      },
      (err) => {
        console.error('Failed to fetch Job No:', err);
      }
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

    let country = '';
    if (payloadType === 'EmptyYard') {
      const polValue = this.generalForm?.get('gen_Pol')?.value || '';
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
        console.error(`Error fetching data from ${serviceMethod}:`, error);
        return of([]);
      })
    );
  }
  getAutocompleteOptions(fieldId: string): string[] {
    return (this as any)[`${fieldId}Suggestions`] || [];
  }

  private buildPayload(form: FormGroup, extraData: any = {}): any {
    return {
      ...form.getRawValue(),
      ...extraData,
    };
  }

  private saveSection(
    form: FormGroup,
    apiCall: (payload: any) => Observable<any>,
    extraData: any = {},
    onSuccess?: (res: any) => void
  ): void {
    if (form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const payload = this.buildPayload(form, extraData);

    apiCall(payload).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.toastService.addToast('success', 'Success', res.Message);
          onSuccess?.(res);
        } else {
          this.toastService.addToast(
            'error',
            'Save Failed',
            res.Message || res.Error
          );
        }
      },
      error: () => {},
    });
  }

  OnGeneralSave(): void {
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
      }
    );
    this.isModifyVisible = true;
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
    this.fetchGridData('INVOICE');
  }

  OnContainerSave(action: any): void {
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
    this.fetchGridData('CONTAINER');
  }

  OnVesselSave(action: any): void {
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
    this.fetchGridData('VESSEL');
  }

  onSearch() {
    if (this.tabName === 'GENERAL') {
      this.isGridVisible = true;
      this.searchClicked = true;
    }
    this.fetchGridData(this.tabName);
  }

  //Search Details
  fetchGridData(tab: string) {
    const apiMap: any = {
      GENERAL:
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_SearchGeneralData.ashx',
      INVOICE:
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_SearchInvoiceDetails.ashx',
      CONTAINER:
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_SearchContDetails.ashx',
      VESSEL:
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_SearchVesselDetails.ashx',
    };

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

    const apiUrl = apiMap[tab];
    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };
    if (this.tabName !== 'OPERATION') {
      this.http.post(apiUrl, payload).subscribe(
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
          this.isGridVisible = false;
        }
      );
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
        break;
      case 'OPERATION DETAILS':
        this.tabName = 'OPERATION';
        this.gridData = [];
        break;
      case 'INVOICE DETAILS':
        this.tabName = 'INVOICE';
        break;
      case 'CONTAINER DETAILS':
        this.tabName = 'CONTAINER';
        break;
      case 'VESSEL DETAILS':
        this.tabName = 'VESSEL';
        break;
      default:
        this.tabName = this.tabName;
        return;
    }
    this.fetchGridData(this.tabName);
  }

  fillGeneralForm(row: any) {
    this.isModifyVisible = true;
    this.isoperModifyVisible = true;
    this.isGridVisible = false;
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
    this.generalFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractGeneralRowKey(fieldId);

      if (key === 'JobDate' && row[key]) {
        formValues[fieldId] = this.convertToDateInputFormat(row[key]);
      } else {
        formValues[fieldId] = row[key] ?? '';
      }
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

    this.ModifyJobId = '';
    this.InvoiceID = '';
    this.ContainerID = '';
    this.VesselID = '';
    this.isModifyVisible = false;
    this.getJobNo();
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
  }
}
