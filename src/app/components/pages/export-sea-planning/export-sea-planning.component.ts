import {
  Component,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  SavedJobId: any | undefined;
  ModifyJobId: any | undefined;
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
  isGridVisible: boolean = false;
  fullGridData: string[] = [];
  selectedColumns: string[] = [];

  generalFields = [
    { label: 'Job No', type: 'text', id: 'gen_JobNo' },
    {
      label: 'Job Date',
      type: 'date',
      id: 'gen_JobDate',
      value: new Date().toISOString().split('T')[0],
    },
    {
      label: 'Client Name',
      type: 'autocomplete',
      id: 'gen_ClientName',
      mandatory: true,
    },
    { label: 'Shipper/Exporter Name', type: 'autocomplete', id: 'gen_Shipper' },
    { label: 'Consignee Name', type: 'autocomplete', id: 'gen_Consignee' },
    { label: 'POL', type: 'autocomplete', id: 'gen_Pol', mandatory: true },
    { label: 'POD', type: 'autocomplete', id: 'gen_Pod', mandatory: true },
    { label: 'FPOD', type: 'autocomplete', id: 'gen_Fpod' },
    {
      label: 'Item Description',
      type: 'textarea',
      id: 'gen_ItemDesc',
      mandatory: true,
    },
    {
      label: 'Type of Commodity',
      type: 'select',
      id: 'gen_CommodityType',
      options: ['Non DG', 'DG'],
    },
    {
      label: 'Shipping Line Name',
      type: 'autocomplete',
      id: 'gen_ShiplineName',
    },
    { label: 'Empty Yard Name', type: 'autocomplete', id: 'gen_EmptyName' },
    { label: 'Shipment No', type: 'text', id: 'gen_ShipNo' },
    { label: 'TotalDay of Transit', type: 'text', id: 'gen_TotTrans' },
    { label: 'Free Days', type: 'text', id: 'gen_FreeDays' },
    { label: 'Container Booking No', type: 'text', id: 'gen_ContBokNo' },
    { label: 'Remark', type: 'text', id: 'gen_Remark' },
  ];

  operationFields = [
    { label: 'Created Date', type: 'date', id: 'Oper_CreatedDate' },
    {
      label: 'Examined Date',
      type: 'date',
      id: 'Oper_ExaminedDate',
    },
    {
      label: 'Leo Date',
      type: 'date',
      id: 'Oper_LeoDate',
    },
    { label: 'Hand Over Date', type: 'date', id: 'Oper_HandOver' },
    { label: 'VGM Updated Date', type: 'date', id: 'Oper_VgmUpdated' },
    { label: 'Form 13 Updated Date', type: 'date', id: 'Oper_Form13' },
    { label: 'Gate In Date', type: 'date', id: 'Oper_GateInDate' },
    { label: 'OnBoard Date', type: 'date', id: 'Oper_OnBoardDate' },
    { label: 'Depature Date', type: 'date', id: 'Oper_DepatureDate' },
    { label: 'Pre Alert Date', type: 'date', id: 'Oper_PreAlertDate' },
    { label: 'Delivery Date', type: 'date', id: 'Oper_DeliveryDate' },
  ];

  invoiceFields = [
    { label: 'Invoice No', type: 'text', id: 'inv_InvoiceNo' },
    { label: 'Invoice Date', type: 'date', id: 'inv_InvoiceDate' },
    { label: 'Invoice Value', type: 'number', id: 'inv_InvoiceValue' },
    { label: 'Currency', type: 'autocomplete', id: 'inv_Currency' },
    { label: 'Ex-Rate', type: 'number', id: 'inv_ExRate' },
    { label: 'Terms', type: 'autocomplete', id: 'inv_Terms' },
    { label: 'FOB Value', type: 'number', id: 'inv_FobValue' },
    { label: 'SB No', type: 'text', id: 'inv_SbNo' },
    { label: 'SB Date', type: 'date', id: 'inv_SbDate' },
    { label: 'No of Packages', type: 'number', id: 'inv_NoOfpackage' },
    {
      label: 'Type Of Packages',
      type: 'autocomplete',
      id: 'inv_TypeOfPackage',
    },
    { label: 'Gross Weight', type: 'number', id: 'inv_GrossWeight' },
    { label: 'Net Weight', type: 'number', id: 'inv_NetWeight' },
    { label: 'CBM', type: 'number', id: 'inv_Cbm' },
    { label: 'Unit Type', type: 'autocomplete', id: 'inv_UnitType' },
  ];

  containerFields = [
    { label: 'Container Size', type: 'autocomplete', id: 'cont_ContainerSize' },
    {
      label: 'Container No',
      type: 'text',
      id: 'cont_ContainerNo',
    },
    { label: 'Line Seal No', type: 'text', id: 'cont_SealNo' },
    { label: 'Custom Seal No', type: 'text', id: 'cont_CustomsealNo' },
    { label: 'From Place', type: 'autocomplete', id: 'cont_FromPlace' },
    { label: 'To Place', type: 'autocomplete', id: 'cont_ToPlace' },
    {
      label: 'Transporter Name',
      type: 'autocomplete',
      id: 'cont_TransporterName',
    },
    { label: 'Vehicle No', type: 'text', id: 'cont_VehicleNo' },
    { label: 'Driver Mobile', type: 'number', id: 'cont_DriverMobile' },
    { label: 'Remarks', type: 'text', id: 'cont_Remarks' },
  ];

  vesselFields = [
    { label: 'From', type: 'autocomplete', id: 'vess_from' },
    { label: 'To', type: 'autocomplete', id: 'vess_To' },
    { label: 'Vessel Name', type: 'autocomplete', id: 'vess_VesselName' },
    { label: 'Voyage No', type: 'text', id: 'vess_VoyageNo' },
    { label: 'ETD', type: 'date', id: 'vess_Etd' },
    { label: 'ETA', type: 'date', id: 'vess_Eta' },
    { label: 'ROT No', type: 'text', id: 'vess_RotNo' },
    { label: 'Via No', type: 'text', id: 'vess_ViaNo' },
  ];

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @ViewChild('OPERATION', { static: false }) OPERATION!: TemplateRef<any>;
  @ViewChild('INVOICE', { static: false }) INVOICE!: TemplateRef<any>;
  @ViewChild('CONTAINER', { static: false }) CONTAINER!: TemplateRef<any>;
  @ViewChild('VESSEL', { static: false }) VESSEL!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
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
    const fields = [
      {
        field: 'gen_ClientName',
        method: 'fetchClientSuggestions',
        payloadType: 'client',
        formType: 'generalForm',
      },
      {
        field: 'gen_Shipper',
        method: 'fetchShipperSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_Consignee',
        method: 'fetchConsigneeSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_Pol',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_Pod',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_Fpod',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_ShiplineName',
        method: 'fetchShippingLineSuggestions',
        payloadType: 'common',
        formType: 'generalForm',
      },
      {
        field: 'gen_EmptyName',
        method: 'fetchEmptyYardNameSuggestions',
        payloadType: 'EmptyYard',
        formType: 'generalForm',
      },
      {
        field: 'inv_Currency',
        method: 'fetchInvCurrencySuggestions',
        payloadType: 'InputVal',
        formType: 'invoiceForm',
      },
      {
        field: 'inv_Terms',
        method: 'fetchInvTermsSuggestions',
        payloadType: 'InputVal',
        formType: 'invoiceForm',
      },
      {
        field: 'inv_TypeOfPackage',
        method: 'fetchInvTypePackgSuggestions',
        payloadType: 'InputVal',
        formType: 'invoiceForm',
      },
      {
        field: 'inv_UnitType',
        method: 'fetchInvUnitSuggestions',
        payloadType: 'InputVal',
        formType: 'invoiceForm',
      },
      {
        field: 'cont_ContainerSize',
        method: 'fetchContSizeSuggestions',
        payloadType: 'InputVal',
        formType: 'containerForm',
      },
      {
        field: 'cont_FromPlace',
        method: 'fetchContFromToSuggestions',
        payloadType: 'common',
        formType: 'containerForm',
      },
      {
        field: 'cont_ToPlace',
        method: 'fetchContFromToSuggestions',
        payloadType: 'common',
        formType: 'containerForm',
      },
      {
        field: 'cont_TransporterName',
        method: 'fetchContTransSuggestions',
        payloadType: 'common',
        formType: 'containerForm',
      },
      {
        field: 'vess_from',
        method: 'fetchVesselFromSuggestions',
        payloadType: 'InputVal',
        formType: 'vesselForm',
      },
      {
        field: 'vess_To',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
        formType: 'vesselForm',
      },
      {
        field: 'vess_VesselName',
        method: 'fetchVesselNameSuggestions',
        payloadType: 'InputVal',
        formType: 'vesselForm',
      },
    ];

    fields.forEach(({ field, method, payloadType, formType }) => {
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
  fetchContFromToSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetFromToPlaces',
      'GetFromToPlace',
      'AccountName',
      payloadType
    );
  }

  fetchContTransSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetTransporterName',
      'GetTransporterName',
      'AccountName',
      payloadType
    );
  }

  fetchVesselFromSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetVesselFrom',
      'GetVesselFrom',
      'PortName',
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

  OnGeneralSave(action: any): void {
    const data = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
      Nvocc_AgentID: localStorage.getItem('AgentID'),
      ...(action === 'Modify' &&
        this.ModifyJobId && { JobID: this.ModifyJobId }),
    };

    this.saveSection(
      this.generalForm,
      this.agentService.NVOCC_Save_ExportSea_General.bind(this.agentService),
      data,
      (res) => {
        this.SavedJobId = res.ReturnJobID;
        this.disabledTabs = [false, false, false, false, false];
      }
    );
  }

  OnOperationsSave(action: any): void {
    const data = {
      CompanyID: this.CompanyId,
      SavedJobID: action === 'Modify' ? this.ModifyJobId : this.SavedJobId,
    };

    console.log(data);

    this.saveSection(
      this.operationForm,
      this.agentService.NVOCC_Save_ExportSea_OperationDetails.bind(
        this.agentService
      ),
      data
    );
  }

  OnInvoiceSave(): void {
    this.saveSection(
      this.invoiceForm,
      this.agentService.NVOCC_Save_ExportSea_InvoiceDetails.bind(
        this.agentService
      ),
      {
        SavedJobID: this.SavedJobId,
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
      }
    );
  }

  OnContainerSave(): void {
    this.saveSection(
      this.containerForm,
      this.agentService.NVOCC_Save_ExportSea_ContainerDetails.bind(
        this.agentService
      ),
      {
        SavedJobID: this.SavedJobId,
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
      }
    );
  }

  OnVesselSave(): void {
    this.saveSection(
      this.vesselForm,
      this.agentService.NVOCC_Save_ExportSea_VesselDetails.bind(
        this.agentService
      ),
      {
        SavedJobID: this.SavedJobId,
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
      }
    );
  }

  //Search Details
  fetchGridData(tab: string) {
    const apiMap: any = {
      GENERAL:
        'https://client.f-studio.in/ServiceNVOC/Nvocc_SearchGeneralData.ashx',
      INVOICE: 'https://your-api-url/invoice',
      CONTAINER: 'https://your-api-url/container',
      VESSEL: 'https://your-api-url/vessel',
    };

    const apiUrl = apiMap[tab];
    const payload = {
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };

    if (!apiUrl) {
      console.error('API URL not found for tab:', tab);
      return;
    }

    this.http.post(apiUrl, payload).subscribe(
      (res: any) => {
        if (res.Status === 'Success') {
          const key = Object.keys(res).find((k) => k.startsWith('Show'))!;
          this.gridData = res[key];

          this.displayedColumns = [
            'JobNo',
            'JobDate',
            'ClientName',
            'Shipper',
            'Pol',
            'Pod',
          ];
          this.isGridVisible = true;
        } else {
          this.gridData = [];
          this.displayedColumns = [];
          this.isGridVisible = false;
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

  fillGeneralForm(row: any) {
    this.isModifyVisible = true;
    this.ModifyJobId = row.ID || null;
    this.isGridVisible = false;

    const formValues: any = {};
    const operationFormValues: any = {};

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

    this.generalForm.patchValue(formValues);
    this.operationForm.patchValue(operationFormValues);
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^gen_/, '');
  }

  extractOperationRowKey(fieldId: string): string {
    return fieldId.replace(/^Oper_/, '');
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

  clearAllForms(): void {
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

    this.SavedJobId = '';
    this.ModifyJobId = '';
    this.isModifyVisible = false;
  }
}
