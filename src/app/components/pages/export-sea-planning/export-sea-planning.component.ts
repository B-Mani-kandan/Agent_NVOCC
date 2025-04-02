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
    { label: 'Job No', type: 'text', id: 'jobNo' },
    {
      label: 'Job Date',
      type: 'date',
      id: 'jobDate',
      value: new Date().toISOString().split('T')[0],
      mandatory: true,
    },
    { label: 'Client Name', type: 'autocomplete', id: 'clientName' },
    { label: 'Shipper/Exporter Name', type: 'autocomplete', id: 'shipper' },
    { label: 'Consignee Name', type: 'autocomplete', id: 'consignee' },
    { label: 'POL', type: 'text', id: 'pol', mandatory: true },
    { label: 'POD', type: 'text', id: 'pod', mandatory: true },
    { label: 'FPOD', type: 'text', id: 'fpod' },
    {
      label: 'Item Description',
      type: 'textarea',
      id: 'itemDesc',
      mandatory: true,
    },
    {
      label: 'Type of Commodity',
      type: 'select',
      id: 'commodityType',
      options: ['Non DG', 'DG'],
    },
    { label: 'CFS Name', type: 'text', id: 'cfsName' },
    { label: 'CHA Name', type: 'text', id: 'chaName' },
    { label: 'Co-Loader Name', type: 'text', id: 'coloadName' },
    { label: 'Forwarder Name', type: 'text', id: 'frwdName' },
    { label: 'Shipping Line Name', type: 'text', id: 'shiplineName' },
    { label: 'Empty Yard Name', type: 'text', id: 'emptyName' },
    { label: 'Shipment No', type: 'text', id: 'shipNo' },
    { label: 'TotalDay of Transit', type: 'text', id: 'totTrans' },
    { label: 'Free Days', type: 'text', id: 'freeDays' },
    { label: 'Container Booking No', type: 'text', id: 'contBokNo' },
    { label: 'Remark', type: 'text', id: 'remark' },
  ];

  operationFields = [
    { label: 'Lead Owner', type: 'text', id: 'leadOwner' },
    {
      label: 'Ownership',
      type: 'select',
      id: 'ownership',
      options: ['Private', 'Public'],
    },
    {
      label: 'Lead Type',
      type: 'select',
      id: 'leadType',
      options: ['Hot', 'Cold'],
    },
    { label: 'Lead Source', type: 'text', id: 'leadSource' },
  ];

  invoiceFields = [
    { label: 'Invoice Number', type: 'text', id: 'invoiceNo' },
    { label: 'Invoice Date', type: 'date', id: 'invoiceDate' },
    { label: 'Amount', type: 'text', id: 'amount' },
  ];

  containerFields = [
    { label: 'Container No', type: 'text', id: 'containerNo' },
    { label: 'Size', type: 'select', id: 'size', options: ['20ft', '40ft'] },
    { label: 'Seal No', type: 'text', id: 'sealNo' },
  ];

  vesselFields = [
    { label: 'Vessel Name', type: 'text', id: 'vesselName' },
    { label: 'Voyage No', type: 'text', id: 'voyageNo' },
    { label: 'Departure Date', type: 'date', id: 'departureDate' },
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
      GENERAL: ['cfsName'],
      OPERATION: ['leadOwner', 'leadSource'],
    };
    return (fieldId: string) =>
      inputGroupFields[templateId]?.includes(fieldId) || false;
  }

  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: ['pol', 'pod', 'fpod', 'itemDesc'],
      OPERATION: ['leadType'],
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
