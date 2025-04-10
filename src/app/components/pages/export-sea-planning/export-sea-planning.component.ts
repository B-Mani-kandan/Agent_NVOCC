import {
  Component,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
import { AgentService } from '../../../services/agent.service';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
const ELEMENT_DATA = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Alice', email: 'alice@example.com' },
  { id: 5, name: 'Bob', email: 'bob@example.com' },
  { id: 6, name: 'Charlie', email: 'charlie@example.com' },
  { id: 7, name: 'Alice', email: 'alice@example.com' },
  { id: 8, name: 'Bob', email: 'bob@example.com' },
  { id: 9, name: 'Charlie', email: 'charlie@example.com' },
  { id: 10, name: 'Alice', email: 'alice@example.com' },
  { id: 11, name: 'Bob', email: 'bob@example.com' },
  { id: 12, name: 'Charlie', email: 'charlie@example.com' },
];
@Component({
  selector: 'app-export-sea-planning',
  standalone: true,
  imports: [
    TabPanelComponent,
    DynamicFormsComponent,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
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

  displayedColumns: string[] = ['id', 'name', 'email'];
  ELEMENT_DATA = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    // Add more mock data...
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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

  constructor(private fb: FormBuilder, private agentService: AgentService) {}

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
    this.dataSource.paginator = this.paginator;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getInputGroupFields(templateId: string): (fieldId: string) => boolean {
    const inputGroupFields: Record<string, string[]> = {
      // GENERAL: ['gen_CfsName'],
    };
    return (fieldId: string) =>
      inputGroupFields[templateId]?.includes(fieldId) || false;
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
        payloadType: 'shippingLine',
        formType: 'generalForm',
      },
      {
        field: 'gen_EmptyName',
        method: 'fetchEmptyYardNameSuggestions',
        payloadType: 'common',
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

    const payloadMap: Record<string, any> = {
      InputVal: { InputVal: input },
      common: { InputVal: input, CompanyId: this.CompanyId },
      client: { InputVal: input, CompanyID: this.CompanyId, CompID: '1575' },
      forwarder: { InputVal: input, CompanyId: this.CompanyId },
      shippingLine: { InputVal: input, CompanyId: this.CompanyId, Country: '' },
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
          console.log('Saved Successfully');
          onSuccess?.(res);
        } else {
          console.error('Save failed:', res.Message || res.Error);
        }
      },
      error: (err) => {
        console.error('API Error:', err);
      },
    });
  }

  OnGeneralSave(): void {
    this.saveSection(
      this.generalForm,
      this.agentService.NVOCC_Save_ExportSea_General.bind(this.agentService),
      {
        JobID: this.generalForm.getRawValue().JobID || '',
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
        Nvocc_AgentID: '',
      },
      (res) => {
        this.SavedJobId = res.ReturnJobID;
        this.disabledTabs = [false, false, false, false, false];
      }
    );
  }

  OnOperationsSave(): void {
    this.saveSection(
      this.operationForm,
      this.agentService.NVOCC_Save_ExportSea_OperationDetails.bind(
        this.agentService
      ),
      {
        SavedJobID: this.SavedJobId,
        CompanyID: this.CompanyId,
      }
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
}
