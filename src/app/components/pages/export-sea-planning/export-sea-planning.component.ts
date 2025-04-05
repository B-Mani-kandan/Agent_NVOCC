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
@Component({
  selector: 'app-export-sea-planning',
  imports: [TabPanelComponent, DynamicFormsComponent],
  templateUrl: './export-sea-planning.component.html',
  styleUrl: './export-sea-planning.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ExportSeaPlanningComponent {
  CompanyId: string | undefined;
  tabLabels: string[] = [
    'GENERAL',
    'OPERATION DETAILS',
    'INVOICE DETAILS',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
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
    { label: 'CFS Name', type: 'autocomplete', id: 'gen_CfsName' },
    { label: 'CHA Name', type: 'autocomplete', id: 'gen_ChaName' },
    { label: 'Co-Loader Name', type: 'autocomplete', id: 'gen_ColoadName' },
    { label: 'Forwarder Name', type: 'autocomplete', id: 'gen_FrwdName' },
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
    { label: 'Currency', type: 'text', id: 'inv_Currency' },
    { label: 'Ex-Rate', type: 'number', id: 'inv_ExRate' },
    { label: 'Terms', type: 'text', id: 'inv_Terms' },
    { label: 'FOB Value', type: 'number', id: 'inv_FobValue' },
    { label: 'SB No', type: 'text', id: 'inv_SbNo' },
    { label: 'SB Date', type: 'date', id: 'inv_SbDate' },
    { label: 'No of Packages', type: 'number', id: 'inv_NoOfpackage' },
    { label: 'Type Of Packages', type: 'text', id: 'inv_TypeOfPackage' },
    { label: 'Gross Weight', type: 'number', id: 'inv_GrossWeight' },
    { label: 'Net Weight', type: 'number', id: 'inv_NetWeight' },
    { label: 'CBM', type: 'number', id: 'inv_Cbm' },
    { label: 'Unit Type', type: 'text', id: 'inv_UnitType' },
  ];

  containerFields = [
    { label: 'Container Size', type: 'text', id: 'cont_ContainerSize' },
    {
      label: 'Container No',
      type: 'text',
      id: 'cont_ContainerNo',
    },
    { label: 'Line Seal No', type: 'text', id: 'cont_SealNo' },
    { label: 'Custom Seal No', type: 'text', id: 'cont_CustomsealNo' },
    { label: 'From Place', type: 'text', id: 'cont_FromPlace' },
    { label: 'To Place', type: 'text', id: 'cont_ToPlace' },
    { label: 'Transporter Name', type: 'text', id: 'cont_TransporterName' },
    { label: 'Vehicle No', type: 'text', id: 'cont_VehicleNo' },
    { label: 'Driver Mobile', type: 'number', id: 'cont_DriverMobile' },
    { label: 'Remarks', type: 'text', id: 'cont_Remarks' },
  ];

  vesselFields = [
    { label: 'From', type: 'text', id: 'vess_from' },
    { label: 'To', type: 'text', id: 'vess_To' },
    { label: 'Vessel Name', type: 'text', id: 'vess_VesselName' },
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
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
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
  setupAutocompleteListeners() {
    const fields = [
      {
        field: 'gen_ClientName',
        method: 'fetchClientSuggestions',
        payloadType: 'client',
      },
      {
        field: 'gen_Shipper',
        method: 'fetchShipperSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_Consignee',
        method: 'fetchConsigneeSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_Pol',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_Pod',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_Fpod',
        method: 'fetchPortSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_CfsName',
        method: 'fetchAccountSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_ChaName',
        method: 'fetchAccountSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_ColoadName',
        method: 'fetchAccountSuggestions',
        payloadType: 'common',
      },
      {
        field: 'gen_FrwdName',
        method: 'fetchAccountSuggestions',
        payloadType: 'forwarder',
      },
      {
        field: 'gen_ShiplineName',
        method: 'fetchShippingLineSuggestions',
        payloadType: 'shippingLine',
      },
      {
        field: 'gen_EmptyName',
        method: 'fetchEmptyYardNameSuggestions',
        payloadType: 'common',
      },
    ];

    fields.forEach(({ field, method, payloadType }) => {
      this.generalForm
        .get(field)
        ?.valueChanges.pipe(
          debounceTime(100),
          distinctUntilChanged(),
          switchMap((input) => (this as any)[method](input, payloadType))
        )
        .subscribe((options) => {
          (this as any)[`${field}Suggestions`] = options;
        });
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

  fetchAccountSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'Nvocc_GetCFSName',
      'CFSName',
      'AccountName',
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

  fetchData(
    input: string,
    serviceMethod: string,
    responseKey: string,
    itemKey: string,
    payloadType: string
  ): Observable<string[]> {
    if (!input) return of([]);

    const payloadMap: Record<string, any> = {
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
}
