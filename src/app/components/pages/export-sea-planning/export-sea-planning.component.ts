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
    { label: 'POL', type: 'text', id: 'gen_Pol', mandatory: true },
    { label: 'POD', type: 'text', id: 'gen_Pod', mandatory: true },
    { label: 'FPOD', type: 'text', id: 'gen_Fpod' },
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
    { label: 'CFS Name', type: 'text', id: 'gen_CfsName' },
    { label: 'CHA Name', type: 'text', id: 'gen_ChaName' },
    { label: 'Co-Loader Name', type: 'text', id: 'gen_ColoadName' },
    { label: 'Forwarder Name', type: 'text', id: 'gen_FrwdName' },
    { label: 'Shipping Line Name', type: 'text', id: 'gen_ShiplineName' },
    { label: 'Empty Yard Name', type: 'text', id: 'gen_EmptyName' },
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
    this.generalForm
      .get('clientName')
      ?.valueChanges.pipe(
        debounceTime(1),
        distinctUntilChanged(),
        switchMap((input) => this.fetchClientSuggestions(input))
      )
      .subscribe((options) => (this.clientSuggestions = options));

    this.generalForm
      .get('shipper')
      ?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((input) => this.fetchShipperSuggestions(input))
      )
      .subscribe((options) => (this.shipperSuggestions = options));

    this.generalForm
      .get('consignee')
      ?.valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((input) => this.fetchConsigneeSuggestions(input))
      )
      .subscribe((options) => (this.consigneeSuggestions = options));
  }

  fetchClientSuggestions(input: string): Observable<string[]> {
    if (!input) return of([]);
    const companyId = localStorage.getItem('CompanyID');
    const requestPayload = { InputVal: input, CompanyId: companyId };

    return this.agentService
      .NVOCC_GetYardName(requestPayload)
      .pipe(
        map(
          (response) =>
            response?.GetYardName?.map((item: any) => item.AccountName) || []
        )
      );
  }

  fetchShipperSuggestions(input: string): Observable<string[]> {
    if (!input) return of([]);
    const companyId = localStorage.getItem('CompanyID');
    const requestPayload = { InputVal: input, CompanyId: companyId };

    return this.agentService
      .NVOCC_GetShipperName(requestPayload)
      .pipe(map((response) => response?.data || []));
  }

  fetchConsigneeSuggestions(input: string): Observable<string[]> {
    if (!input) return of([]);
    const companyId = localStorage.getItem('CompanyID');
    const requestPayload = { InputVal: input, CompanyId: companyId };

    return this.agentService
      .NVOCC_GetConsigneeName(requestPayload)
      .pipe(map((response) => response?.data || []));
  }

  getAutocompleteOptions(fieldId: string): string[] {
    if (fieldId === 'clientName') return this.clientSuggestions;
    if (fieldId === 'shipper') return this.shipperSuggestions;
    if (fieldId === 'consignee') return this.consigneeSuggestions;
    return [];
  }
}
