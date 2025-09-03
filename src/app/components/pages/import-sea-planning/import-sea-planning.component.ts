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
  IMP_BLIGM_FIELDS,
  IMP_VESSEL_FIELDS,
  IMP_CONTAINER_FIELDS,
} from './import-sea-input-fields.config';
import { IMP_AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-import-sea-planning',
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
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
  AgentID: any | undefined;
  ModifyJobId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  IGMID: any | undefined;
  InvoiceID: any | undefined;
  GridSelection: any | undefined;
  Imp_tabName: string = 'GENERAL';
  IMPGENRAL: string = 'IMPGENERAL';
  Imp_tabLabels: string[] = [
    'GENERAL',
    'BL/IGM DETAILS',
    'INVOICE DETAILS',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
  imp_GeneralForm!: FormGroup;
  imp_BligmForm!: FormGroup;
  imp_InvoiceForm!: FormGroup;
  imp_ContainerForm!: FormGroup;
  imp_VesselForm!: FormGroup;
  gridData: any[] = [];
  displayedColumns: string[] = [];
  currentActionMap: { label: string; icon: string }[] = [];

  imp_GeneralFields = IMP_GENERAL_FIELDS;
  imp_BligmFields = IMP_BLIGM_FIELDS;
  imp_InvoiceFields = IMP_INVOICE_FIELDS;
  imp_ContainerFields = IMP_CONTAINER_FIELDS;
  imp_VesselFields = IMP_VESSEL_FIELDS;
  importfirstGridVisible: boolean = true;
  isTabPanelVisible: boolean = false;
  isGridVisible: boolean = false;
  isModifyVisible: boolean = false;
  isInvoiceModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  isVesselModifyVisible: boolean = false;
  isBLIGMModifyVisible: boolean = false;
  searchClicked: boolean = false;

  ngOnInit() {
    this.imp_GeneralForm = this.createForm(this.imp_GeneralFields);
    this.imp_BligmForm = this.createForm(this.imp_BligmFields);
    this.imp_InvoiceForm = this.createForm(this.imp_InvoiceFields);
    this.imp_ContainerForm = this.createForm(this.imp_ContainerFields);
    this.imp_VesselForm = this.createForm(this.imp_VesselFields);
    this.setupAutocompleteListeners();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.FinanceYear = '2025-2026';
    this.BranchID = '1594';
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.getJobNo();
    this.getCurrentDate();
    this.fetchGridData('GENERAL');
    this.IMPGENRAL = 'IMPGENERAL';
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  @ViewChild('IMP_GENERAL', { static: false }) IMP_GENERAL!: TemplateRef<any>;
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
        this.IMP_BLIGM &&
        this.IMP_INVOICE &&
        this.IMP_CONTAINER &&
        this.IMP_VESSEL
      ) {
        this.tabContents = [
          this.IMP_GENERAL,
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

  getCurrentDate() {
    const today = new Date();
    this.imp_GeneralForm.patchValue({
      Imp_gen_JobDate: today.toISOString().split('T')[0],
    });
  }

  getJobNo(): void {
    const payload = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.agentService.NVOCC_Import_GetJobNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetImpJobNo?.length > 0) {
          const jobNo = res.GetImpJobNo[0]?.orderno;
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

  fetchSupplierNameSuggestions(
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
      const polValue = this.imp_GeneralForm?.get('Imp_gen_Pol')?.value || '';
      country = polValue;
    } else if (payloadType === 'ContainerNo') {
      const Empty = this.imp_GeneralForm?.get('Imp_gen_EmptyName')?.value;
      const contsize = this.imp_ContainerForm?.get(
        'Imp_cont_ContainerSize'
      )?.value;
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

  onSearch() {
    if (this.Imp_tabName === 'GENERAL') {
      this.importfirstGridVisible = false;
      this.isTabPanelVisible = false;
      this.isGridVisible = true;
    }
    this.fetchSearchGridData(this.Imp_tabName);
  }

  HandleRowActionFirstGrid(event: { action: string; data: any }) {
    this.fillGeneralForm(event.data);
    this.importfirstGridVisible = false;
    this.isTabPanelVisible = true;
    this.isGridVisible = false;
    this.GridSelection = 'FirstGridData';
    this.getJobNo();
    this.getCurrentDate();
  }

  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.fillGeneralForm(event.data);
      this.isModifyVisible = true;
      this.isTabPanelVisible = true;
      this.importfirstGridVisible = false;
    } else if (event.action === 'delete') {
      this.onRowDelete(event.data);
      this.isTabPanelVisible = true;
      this.importfirstGridVisible = false;
    } else {
      this.handleGeneralTabDownload(event.action, event.data);
    }
    this.GridSelection = 'SecondGridData';
  }

  private handleGeneralTabDownload(action: string, data: any) {
    const payload = {
      CompanyID: this.CompanyId,
      JobID: data.ID,
    };
    Swal.fire({
      title: `Are you sure you want to download ${action} Print?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download it!',
      cancelButtonText: 'No, cancel',
      customClass: {
        title: 'swal-title-small',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService.fetchGeneralActionFile(action, payload).subscribe(
          (resp: any) => {
            if (resp && resp.File) {
              this.downloadPdf(resp.File, `${action}.pdf`);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: `${this.capitalize(action)} Print No Data Found`,
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: `${this.capitalize(action)} ${
                error?.Message || 'No Data Found'
              }`,
            });
          }
        );
      }
    });
  }

  downloadPdf(fileUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['select', 'JobNo', 'JobDate', 'Shipper', 'Pol', 'Pod'],
      BLDETAILS: ['Mblno', 'MblDate', 'MBLType'],
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
      AgentID: this.AgentID,
      FinanceYear: this.FinanceYear,
    };

    this.agentService.fetchExpConvImpGridData(tab, payload).subscribe(
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

  fetchSearchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: [
        'select',
        'JobNo',
        'JobDate',
        'Shipper',
        'Pol',
        'Pod',
        'actions',
      ],
      BLDETAILS: ['select', 'Mblno', 'MblDate', 'MBLType'],
      INVOICE: [
        'select',
        'InvoiceNo',
        'InvoiceDate',
        'InvoiceValue',
        'Currency',
        'Terms',
      ],
      CONTAINER: ['select', 'ContainerNo', 'ContainerSize', 'LineSealNo'],
      VESSEL: ['select', 'POL', 'POD', 'VesselName', 'Etd', 'Eta'],
    };

    const actionMap: any = {
      GENERAL: [
        { label: 'CAN', icon: 'print' },
        { label: 'DO', icon: 'print' },
      ],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };

    this.agentService.fetchImportSearchGridData(tab, payload).subscribe(
      (res: any) => {
        if (res.Status === 'Success') {
          const key = Object.keys(res).find((k) => k.startsWith('Show'))!;
          this.gridData = res[key];
          this.displayedColumns = columnMap[tab];
          this.currentActionMap = actionMap[tab];
        } else {
          this.gridData = [];
          this.displayedColumns = columnMap[tab];
          this.currentActionMap = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
        this.gridData = [];
        this.displayedColumns = [];
        this.currentActionMap = [];
        this.isGridVisible = false;
      }
    );
  }

  onTabChange(tabIndex: number): void {
    this.Imp_tabName = this.Imp_tabLabels[tabIndex];
    switch (this.Imp_tabName) {
      case 'GENERAL':
        this.Imp_tabName = 'GENERAL';
        this.isGridVisible = false;
        this.gridData = [];
        break;
      case 'BL/IGM DETAILS':
        this.Imp_tabName = 'BLDETAILS';
        if (this.GridSelection === 'FirstGridData') {
          this.isGridVisible = true;
        } else {
          this.isGridVisible = true;
        }
        break;
      case 'INVOICE DETAILS':
        this.Imp_tabName = 'INVOICE';
        this.isGridVisible = true;
        break;
      case 'CONTAINER DETAILS':
        this.Imp_tabName = 'CONTAINER';
        this.isGridVisible = true;
        break;
      case 'VESSEL DETAILS':
        this.Imp_tabName = 'VESSEL';
        this.isGridVisible = true;
        break;
      default:
        this.Imp_tabName = this.Imp_tabName;
        return;
    }
    if (this.GridSelection === 'FirstGridData') {
      this.fetchGridData(this.Imp_tabName);
    } else {
      this.fetchSearchGridData(this.Imp_tabName);
    }
  }

  // Populate fields
  fillGeneralForm(row: any) {
    this.isModifyVisible = false;
    this.isGridVisible = false;
    this.ModifyJobId = row.ID || null;

    if (this.Imp_tabName === 'INVOICE') {
      this.InvoiceID = row.InvoiceID || null;
      this.isInvoiceModifyVisible = true;
      this.isGridVisible = true;
      const invoiceFormValues: any = {};
      this.imp_InvoiceFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractInvoiceRowKey(fieldId);
        invoiceFormValues[fieldId] =
          key === 'InvoiceDate' && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_InvoiceForm.patchValue(invoiceFormValues);
    } else if (this.Imp_tabName === 'BLDETAILS') {
      this.IGMID = row.IGMID || null;
      this.isBLIGMModifyVisible = true;
      this.isGridVisible = true;

      const bligmFormValues: any = {};
      this.imp_BligmFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractBligmRowKey(fieldId);
        bligmFormValues[fieldId] =
          key === 'MblDate' && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_BligmForm.patchValue(bligmFormValues);
    } else if (this.Imp_tabName === 'CONTAINER') {
      this.ContainerID = row.ContID || null;
      this.isContModifyVisible = true;
      this.isGridVisible = true;

      const containerFormValues: any = {};
      const dateFields = ['EmptyReturnDate', 'ValidDate'];
      this.imp_ContainerFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractContainerRowKey(fieldId);
        containerFormValues[fieldId] =
          dateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_ContainerForm.patchValue(containerFormValues);
    } else if (this.Imp_tabName === 'VESSEL') {
      this.VesselID = row.VesselID || null;
      this.isVesselModifyVisible = true;
      this.isGridVisible = true;

      const vesselFormValues: any = {};
      const dateFields = ['Etd', 'Eta'];
      this.imp_VesselFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractVesselRowKey(fieldId);
        vesselFormValues[fieldId] =
          dateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_VesselForm.patchValue(vesselFormValues);
    } else if (this.Imp_tabName === 'GENERAL') {
      const formValues: any = {};
      const gendateFields = [
        'JobDate',
        'InwardDate',
        'DoValidDate',
        'DoDate',
        'CanDate',
      ];
      this.imp_GeneralFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractGeneralRowKey(fieldId);
        formValues[fieldId] =
          gendateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_GeneralForm.patchValue(formValues);
    }
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_gen_/, '');
  }

  extractBligmRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_Bligm_/, '');
  }

  extractInvoiceRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_inv_/, '');
  }

  extractContainerRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_cont_/, '');
  }

  extractVesselRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_vess_/, '');
  }

  convertToDateInputFormat(dateStr: string): string {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
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
  //Save All Forms
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
            detail: `${this.capitalize(this.Imp_tabName)} ${res.Message}`,
          });
          onSuccess?.(res);
          this.fetchSearchGridData(this.Imp_tabName);
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

  OnGeneralSave(): void {
    if (!this.validateMandatoryFields(this.imp_GeneralForm, 'GENERAL')) return;
    let data: any;
    if (this.GridSelection === 'FirstGridData') {
      data = {
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
        Nvocc_AgentID: localStorage.getItem('AgentID'),
        JobID: this.ModifyJobId,
        EDIJOBID: '',
      };
    } else {
      data = {
        CompanyID: this.CompanyId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
        Nvocc_AgentID: localStorage.getItem('AgentID'),
        EDIJOBID: this.ModifyJobId,
        JobID: '',
      };
    }

    this.saveSection(
      this.imp_GeneralForm,
      this.agentService.NVOCC_SaveAllForms_ImportSea_General.bind(
        this.agentService
      ),
      data,
      (res) => {
        this.ModifyJobId = res.ReturnJobID;
      }
    );
    this.isModifyVisible = true;
    this.ClearAllForms();
  }

  OnBLIGMSave(action: any): void {
    if (!this.validateMandatoryFields(this.imp_BligmForm, 'BLDETAILS')) return;

    const data = {
      SavedJobID: this.ModifyJobId,
      BLIGMID: action === 'Modify' ? this.IGMID : '',
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.saveSection(
      this.imp_BligmForm,
      this.agentService.NVOCC_Save_ImportSea_BLIGM.bind(this.agentService),
      data
    );
    this.ClearBLIGMForm();
  }

  OnInvoiceSave(action: any): void {
    if (!this.validateMandatoryFields(this.imp_InvoiceForm, 'INVOICE')) return;

    const data = {
      SavedJobID: this.ModifyJobId,
      InvoiceID: action === 'Modify' ? this.InvoiceID : '',
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.saveSection(
      this.imp_InvoiceForm,
      this.agentService.NVOCC_Save_ImportSea_InvoiceDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearInvoiceForm();
  }

  OnContainerSave(action: any): void {
    if (!this.validateMandatoryFields(this.imp_ContainerForm, 'CONTAINER'))
      return;
    const genEmptyName = this.imp_GeneralForm.get('gen_EmptyName')?.value;
    const data = {
      SavedJobID: this.ModifyJobId,
      ContainerID: action === 'Modify' ? this.ContainerID : '',
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
      gen_EmptyName: genEmptyName,
    };
    this.saveSection(
      this.imp_ContainerForm,
      this.agentService.NVOCC_Save_ImportSea_ContainerDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearContainerForm();
  }

  OnVesselSave(action: any): void {
    if (!this.validateMandatoryFields(this.imp_VesselForm, 'VESSEL')) return;
    const data = {
      SavedJobID: this.ModifyJobId,
      VesselID: action === 'Modify' ? this.VesselID : '',
    };
    this.saveSection(
      this.imp_VesselForm,
      this.agentService.NVOCC_Save_ImportSea_VesselDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearVesselForm();
  }

  //Delete
  onRowDelete(row: any): void {
    const jobId = row.ID;
    let apiUrl = '';
    let body: any = { JobID: jobId, CompanyID: this.CompanyId };
    let deleteKey = '';

    if (this.Imp_tabName === 'INVOICE') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteInvoice.ashx';
      body.InvoiceID = row.InvoiceID;
      deleteKey = 'InvoiceID';
    } else if (this.Imp_tabName === 'CONTAINER') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteContainer.ashx';
      body.ContainerID = row.ContID;
      deleteKey = 'ContID';
    } else if (this.Imp_tabName === 'VESSEL') {
      apiUrl =
        'https://client.f-studio.in/ServiceNVOC/Nvocc_Exp_DeleteVessel.ashx';
      body.VesselID = row.VesselID;
      deleteKey = 'VesselID';
    } else {
      return;
    }

    this.http.post(apiUrl, body).subscribe((res: any) => {
      if (res.Status === 'Sucess') {
        this.gridData = this.gridData.filter(
          (item: any) => item[deleteKey] !== row[deleteKey]
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.capitalize(this.Imp_tabName)} ${res.Message}`,
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

  //Clear Forms

  ClearAllForms(): void {
    debugger;
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.imp_GeneralForm,
      bligmForm: this.imp_BligmForm,
      invoiceForm: this.imp_InvoiceForm,
      containerForm: this.imp_ContainerForm,
      vesselForm: this.imp_VesselForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });

    this.ModifyJobId = '';
    this.IGMID;
    this.InvoiceID = '';
    this.ContainerID = '';
    this.VesselID = '';
    this.isModifyVisible = false;
    this.importfirstGridVisible = true;
    this.isTabPanelVisible = false;
    this.isGridVisible = false;
    this.getJobNo();
    this.getCurrentDate();
    this.fetchGridData('GENERAL');
  }

  ClearBLIGMForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      invoiceForm: this.imp_BligmForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.IGMID = '';
    this.isBLIGMModifyVisible = false;
  }

  ClearInvoiceForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      invoiceForm: this.imp_InvoiceForm,
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
      containerForm: this.imp_ContainerForm,
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
      vesselForm: this.imp_VesselForm,
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
