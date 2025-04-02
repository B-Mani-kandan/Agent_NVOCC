// import {
//   Component,
//   ViewChild,
//   TemplateRef,
//   ViewEncapsulation,
// } from '@angular/core';
// import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-export-sea-planning',
//   imports: [TabPanelComponent, ReactiveFormsModule, CommonModule],
//   templateUrl: './export-sea-planning.component.html',
//   styleUrl: './export-sea-planning.component.css',
//   encapsulation: ViewEncapsulation.None,
// })
// export class ExportSeaPlanningComponent {
//   tabLabels: string[] = [
//     'GENERAL',
//     'OPERATION DETAILS',
//     'INVOICE DETAILS',
//     'CONTAINER DETAILS',
//     'VESSEL DETAILS',
//   ];
//   tabContents: TemplateRef<any>[] = [];
//   profileForm!: FormGroup;
//   formFields = [
//     { label: 'Job No', type: 'text', id: 'jobNo' },
//     {
//       label: 'Job Date',
//       type: 'date',
//       id: 'jobDate',
//       value: new Date().toISOString().split('T')[0],
//       mandatory: true,
//     },
//     { label: 'Client Name', type: 'text', id: 'clientName' },
//     { label: 'Shipper/Exporter Name', type: 'text', id: 'shipper' },
//     { label: 'Consignee Name', type: 'text', id: 'consignee' },
//     { label: 'POL', type: 'text', id: 'pol', mandatory: true },
//     { label: 'POD', type: 'text', id: 'pod', mandatory: true },
//     { label: 'FPOD', type: 'text', id: 'fpod' },
//     {
//       label: 'Item Description',
//       type: 'textarea',
//       id: 'itemDesc',
//       mandatory: true,
//     },
//     {
//       label: 'Type of Commodity',
//       type: 'select',
//       id: 'commodityType',
//       options: ['Non DG', 'DG'],
//     },
//     { label: 'CFS Name', type: 'text', id: 'cfsName' },
//     { label: 'CHA Name', type: 'text', id: 'chaName' },
//     { label: 'Co-Loader Name', type: 'text', id: 'coloadName' },
//     { label: 'Forwarder Name', type: 'text', id: 'frwdName' },
//     { label: 'Shipping Line Name', type: 'text', id: 'shiplineName' },
//     { label: 'Empty Yard Name', type: 'text', id: 'emptyName' },
//     { label: 'Shipment No', type: 'text', id: 'shipNo' },
//     { label: 'TotalDay of Transit', type: 'text', id: 'totTrans' },
//     { label: 'Free Days', type: 'text', id: 'freeDays' },
//     { label: 'Container Booking No', type: 'text', id: 'contBokNo' },
//     { label: 'Remark', type: 'text', id: 'remark' },
//   ];

//   @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
//   @ViewChild('OPERATION', { static: false }) OPERATION!: TemplateRef<any>;
//   @ViewChild('INVOICE', { static: false })
//   INVOICE!: TemplateRef<any>;
//   @ViewChild('CONTAINER', { static: false }) CONTAINER!: TemplateRef<any>;
//   @ViewChild('VESSEL', { static: false }) VESSEL!: TemplateRef<any>;

//   ngAfterViewInit() {
//     setTimeout(() => {
//       this.tabContents = [
//         this.GENERAL,
//         this.OPERATION,
//         this.INVOICE,
//         this.CONTAINER,
//         this.VESSEL,
//       ];
//     });
//   }

//   constructor(private fb: FormBuilder) {}
//   ngOnInit() {
//     this.profileForm = this.fb.group(
//       Object.fromEntries(this.formFields.map((field) => [field.id]))
//     );
//   }

//   saveForm() {
//     console.log(this.profileForm.value);
//   }

//   isInputGroupField(fieldId: string): boolean {
//     return ['clientName', 'shipper', 'consignee'].includes(fieldId);
//   }

//   isMandatoryField(fieldId: string): boolean {
//     return ['pol', 'pod', 'fpod', 'itemDesc'].includes(fieldId);
//   }
// }

import {
  Component,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabPanelComponent } from '../../layout/tabpanel/tabpanel.component';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';

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
  generalFields = [
    { label: 'Job No', type: 'text', id: 'jobNo' },
    {
      label: 'Job Date',
      type: 'date',
      id: 'jobDate',
      value: new Date().toISOString().split('T')[0],
      mandatory: true,
    },
    { label: 'Client Name', type: 'text', id: 'clientName' },
    { label: 'Shipper/Exporter Name', type: 'text', id: 'shipper' },
    { label: 'Consignee Name', type: 'text', id: 'consignee' },
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.generalForm = this.createForm(this.generalFields);
    this.operationForm = this.createForm(this.operationFields);
    this.invoiceForm = this.createForm(this.invoiceFields);
    this.containerForm = this.createForm(this.containerFields);
    this.vesselForm = this.createForm(this.vesselFields);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabContents = [
        this.GENERAL,
        this.OPERATION,
        this.INVOICE,
        this.CONTAINER,
        this.VESSEL,
      ];
    });
  }

  createForm(fields: any[]): FormGroup {
    return this.fb.group(Object.fromEntries(fields.map((field) => [field.id])));
  }

  saveForm(data: any) {
    console.log(data);
  }

  getInputGroupFields(templateId: string): (fieldId: string) => boolean {
    const inputGroupFields: Record<string, string[]> = {
      GENERAL: ['clientName', 'shipper', 'consignee'],
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
}
