import {
  Component,
  ViewChild,
  OnInit,
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
import { AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import {
  COMMON_FIELDS,
  GENERAL_FIELDS,
  CONTAINER_FIELDS,
  VESSEL_FIELDS,
} from './container-booking-input-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-container-booking',
  imports: [
    CommonModule,
    TabPanelComponent,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastModule,
    FormsModule,
    LoaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './container-booking.component.html',
  styleUrl: './container-booking.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ContainerBookingComponent implements OnInit {
  CompanyId: string | undefined;
  ModifyJobId: any | undefined;
  JobId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  AgentID: any | undefined;
  tabName: string = 'GENERAL';
  GridSelection: any | undefined;
  tabLabels: string[] = [
    'GENERAL',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
    'MAIL',
  ];
  tabContents: TemplateRef<any>[] = [];
  disabledTabs: boolean[] = [false, true, true, true, true];
  commonForm!: FormGroup;
  ContgeneralForm!: FormGroup;
  ContcontainerForm!: FormGroup;
  ContvesselForm!: FormGroup;
  gridData: any[] = [];
  displayedColumns: string[] = [];
  ContainerfirstGridVisible: boolean = true;
  IMPGENRAL: string = 'IMPGENERAL';
  isTabPanelVisible: boolean = false;
  isModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  isVesselModifyVisible: boolean = false;
  isVesselSaveVisible: boolean = false;
  isContSaveVisible: boolean = false;
  isGridVisible: boolean = false;
  searchClicked: boolean = false;
  fullGridData: string[] = [];
  selectedColumns: string[] = [];
  commonFields = COMMON_FIELDS;
  ContgeneralFields = GENERAL_FIELDS;
  ContcontainerFields = CONTAINER_FIELDS;
  ContvesselFields = VESSEL_FIELDS;
  currentActionMap: { linkid: string; label: string; icon: string }[] = [];
  isLoading = false;
  //Mail

  mailFields = [
    {
      label: 'Container Booking Confirmation',
      value: 'Container Booking Confirmation',
    },
    {
      label: 'Container Release Confirmation',
      value: 'Container Release Confirmation',
    },
  ];
  selectedMailOption: string = 'Container Booking Confirmation';
  mailSubject: string = '';
  toMail: string = '';
  ccMail: string = '';
  mailBody: SafeHtml = '';
  sendMailBody: string = '';

  @ViewChild('CONT_GENERAL', { static: false }) CONT_GENERAL!: TemplateRef<any>;
  @ViewChild('CONT_CONTAINER', { static: false })
  CONT_CONTAINER!: TemplateRef<any>;
  @ViewChild('CONT_VESSEL', { static: false }) CONT_VESSEL!: TemplateRef<any>;
  @ViewChild('MAIL', { static: false }) MAIL!: TemplateRef<any>;

  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.commonForm = this.createForm(this.commonFields);
    this.ContgeneralForm = this.createForm(this.ContgeneralFields);
    this.ContcontainerForm = this.createForm(this.ContcontainerFields);
    this.ContvesselForm = this.createForm(this.ContvesselFields);
    this.setupAutocompleteListeners();
    this.ContgeneralForm.get('Cont_gen_Pol')?.valueChanges.subscribe((val) => {
      this.ContgeneralForm.patchValue(
        { Cont_gen_PrintPol: val },
        { emitEvent: false }
      );
    });
    this.ContgeneralForm.get('Cont_gen_Pod')?.valueChanges.subscribe((val) => {
      this.ContgeneralForm.patchValue(
        { Cont_gen_PrintPod: val },
        { emitEvent: false }
      );
    });
    this.getCurrentDate();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.IMPGENRAL = 'IMPGENERAL';
    this.fetchGridData('GENERAL');
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.CONT_GENERAL &&
        this.CONT_CONTAINER &&
        this.CONT_VESSEL &&
        this.MAIL
      ) {
        this.tabContents = [
          this.CONT_GENERAL,
          this.CONT_CONTAINER,
          this.CONT_VESSEL,
          this.MAIL,
        ];
      } else {
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

  saveForm(data: any) {}
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [
        'Cont_gen_BookingNo',
        'Cont_gen_BookingDate',
        'Cont_gen_BookingExpDt',
        'Cont_gen_ShipperName',
        'Cont_gen_Pol',
        'Cont_gen_Pod',
        'Cont_gen_CarrierName',
        'Cont_gen_ForwarderName',
        'Cont_gen_EmptyName',
        'Cont_gen_Surveyor',
        'Cont_gen_PackageType',
        'Cont_gen_GrossWeight',
        'Cont_gen_NetWeight',
        'Cont_gen_UnitType',
      ],
      CONTAINER: ['Cont_cont_ContainerSize', 'Cont_cont_ContainerNo'],
      VESSEL: ['Cont_vess_POL', 'Cont_vess_POD', 'Cont_vess_VesselName'],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }

  getCurrentDate() {
    const today = new Date();
    this.ContgeneralForm.patchValue({
      Cont_gen_BookingDate: today.toISOString().split('T')[0],
    });
  }
  getBookingNo(): void {
    const payload = {
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    this.agentService.NVOCC_Cont_GetBookingNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetContBookingNo?.length > 0) {
          const bookingNo = res.GetContBookingNo[0]?.bookingNo;
          this.ContgeneralForm.patchValue({
            Cont_gen_BookingNo: bookingNo,
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

  fetchCarrierName(input: string, payloadType: string): Observable<string[]> {
    return this.fetchData(
      input,
      'Nvocc_GetShippingLine',
      'ShippingLineName',
      'AccountName',
      payloadType
    );
  }

  fetchForwarderSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetForwarderName',
      'ForwarderName',
      'AccountName',
      payloadType
    );
  }

  fetchSurveyorSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetSurvoyerName',
      'SurvoyerName',
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

  fetchTypePackgSuggestions(
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

  fetchUnitSuggestions(
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
      const polValue = this.ContgeneralForm?.get('Cont_gen_Pol')?.value || '';
      country = polValue;
    } else if (payloadType === 'ContainerNo') {
      const Empty = this.ContgeneralForm?.get('Cont_gen_EmptyName')?.value;
      const contsize = this.ContcontainerForm?.get(
        'Cont_cont_ContainerSize'
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
      InputVal: { InputVal: input, AgentID: this.AgentID },
      common: {
        InputVal: input,
        CompanyId: this.CompanyId,
        AgentID: this.AgentID,
      },
      EmptyYard: {
        InputVal: input,
        CompanyId: this.CompanyId,
        Country: country,
        AgentID: this.AgentID,
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
    if (this.GridSelection == 'FirstGridData') {
      payload = { CompanyId: this.CompanyId, JobID: this.ModifyJobId };
    } else {
      payload = { CompanyId: this.CompanyId, JobID: this.JobId };
    }

    this.agentService.NVOCC_GetContainer_ContainerSize(payload).subscribe({
      next: (res: any) => {
        if (
          res?.Status === 'Success' &&
          Array.isArray(res.GetContainer_ContainerSize)
        ) {
          const options = res.GetContainer_ContainerSize.map(
            (item: any) => item.CDescription
          );

          const containerSizeField = this.ContcontainerFields.find(
            (f) => f.id === 'Cont_cont_ContainerSize'
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
    const missingFields: string[] = [];

    Object.keys(formGroup.controls).forEach((fieldId) => {
      if (isMandatory(fieldId)) {
        const control = formGroup.get(fieldId);
        if (!control?.value || control.value.toString().trim() === '') {
          control?.markAsTouched();
          allValid = false;

          // take last part after underscore and push
          const parts = fieldId.split('_');
          missingFields.push(parts[parts.length - 1]);
        }
      }
    });

    if (!allValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mandatory',
        detail: `Please fill mandatory fields: ${missingFields.join(', ')}`,
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
          this.fetchSearchGridData(this.tabName);
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
    if (!this.validateMandatoryFields(this.ContgeneralForm, 'GENERAL')) return;
    let data: any;
    if (this.GridSelection === 'FirstGridData') {
      data = {
        CompanyID: this.CompanyId,
        Nvocc_AgentID: this.AgentID,
        JobID: this.ModifyJobId,
        ContainerBookingID: '',
      };
    } else {
      data = {
        CompanyID: this.CompanyId,
        Nvocc_AgentID: this.AgentID,
        ContainerBookingID: this.ModifyJobId,
        JobID: this.JobId,
      };
    }

    const combinedPayload = {
      ...this.commonForm.getRawValue(),
      ...this.ContgeneralForm.getRawValue(),
      ...data,
    };

    this.agentService
      .NVOCC_Save_Container_GeneralDetails(combinedPayload)
      .subscribe({
        next: (res) => {
          if (res.Status === 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `General ${res.Message}`,
            });
            this.ModifyJobId = res.ReturnJobID;
            this.JobId = res.ReturnJobID;
            this.fetchSearchGridData('GENERAL');
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
    this.isModifyVisible = true;
  }
  OnContainerSave(action: any): void {
    if (!this.validateMandatoryFields(this.ContcontainerForm, 'CONTAINER'))
      return;
    const genEmptyName = this.ContgeneralForm.get('Cont_gen_EmptyName')?.value;
    const Pol = this.ContgeneralForm.get('Cont_gen_Pol')?.value;
    const Pod = this.ContgeneralForm.get('Cont_gen_Pod')?.value;
    const data = {
      SavedJobID: this.JobId,
      ContainerID: action === 'Modify' ? this.ContainerID : '',
      CompanyID: this.CompanyId,
      EmptyName: genEmptyName,
      POL: Pol,
      POD: Pod,
    };
    this.saveSection(
      this.ContcontainerForm,
      this.agentService.NVOCC_Save_Container_ContainerDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearContainerForm();
  }

  OnVesselSave(action: any): void {
    if (!this.validateMandatoryFields(this.ContvesselForm, 'VESSEL')) return;
    const data = {
      SavedJobID: this.JobId,
      VesselID: action === 'Modify' ? this.VesselID : '',
    };
    this.saveSection(
      this.ContvesselForm,
      this.agentService.NVOCC_Save_Container_VesselDetails.bind(
        this.agentService
      ),
      data
    );
    this.ClearVesselForm();
  }

  //Search Details

  onSearch() {
    if (this.tabName === 'GENERAL') {
      this.ContainerfirstGridVisible = false;
      this.isTabPanelVisible = false;
      this.isGridVisible = true;
    }
    this.fetchSearchGridData(this.tabName);
  }

  HandleRowActionFirstGrid(event: { action: string; data: any }) {
    this.fillGeneralForm(event.data);
    this.ContainerfirstGridVisible = false;
    this.isTabPanelVisible = true;
    this.isGridVisible = false;
    this.GridSelection = 'FirstGridData';
    this.getBookingNo();
    this.getCurrentDate();
  }
  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.fillGeneralForm(event.data);
      this.isModifyVisible = true;
      this.isTabPanelVisible = true;
      this.ContainerfirstGridVisible = false;
    } else if (event.action === 'delete') {
      this.onRowDelete(event.data);
      this.isTabPanelVisible = true;
      this.ContainerfirstGridVisible = false;
    } else {
      this.handleGeneralTabDownload(event.action, event.data);
    }
    this.GridSelection = 'SecondGridData';
  }
  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['select', 'JobNo', 'JobDate', 'Pol', 'Pod'],
      CONTAINER: ['ContainerNo', 'ContainerSize'],
      VESSEL: ['POL', 'POD', 'VesselName', 'Eta', 'Etd'],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    this.agentService.fetchExpConvContainerGridData(tab, payload).subscribe(
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
        'BookingNo',
        'BookingDate',
        'ShipperName',
        'Pol',
        'Pod',
        'actions',
      ],
      CONTAINER: ['select', 'ContainerNo', 'ContainerSize'],
      VESSEL: ['select', 'POL', 'POD', 'VesselName', 'Eta', 'Etd'],
    };

    const payload = {
      EDIJobID: this.JobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    const actionMap: any = {
      GENERAL: [
        { linkid: 'Booking', label: 'Booking', icon: 'event_note' },
        { linkid: 'Release', label: 'Release', icon: 'lock_open' },
      ],
    };

    this.agentService.fetchContainerGridData(tab, payload).subscribe(
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
        this.gridData = [];
        this.displayedColumns = [];
        this.currentActionMap = [];
        this.isGridVisible = false;
      }
    );
  }

  private handleGeneralTabDownload(action: string, data: any) {
    const payload = {
      ContBookID: data.ID,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    Swal.fire({
      title: `Are you sure you want to download ${action} Print?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService
          .fetchContainerBookingGeneralActionFile(action, payload)
          .subscribe(
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
  onTabChange(tabIndex: number): void {
    this.tabName = this.tabLabels[tabIndex];
    switch (this.tabName) {
      case 'GENERAL':
        this.tabName = 'GENERAL';
        this.isGridVisible = false;
        this.gridData = [];
        break;
      case 'CONTAINER DETAILS':
        this.tabName = 'CONTAINER';
        if (this.GridSelection == 'FirstGridData') {
          this.isContSaveVisible = false;
        } else {
          this.isContSaveVisible = true;
        }
        this.isGridVisible = true;
        this.loadContainerSizes();
        break;
      case 'VESSEL DETAILS':
        this.tabName = 'VESSEL';
        if (this.GridSelection == 'FirstGridData') {
          this.isVesselSaveVisible = false;
        } else {
          this.isVesselSaveVisible = true;
        }
        this.isGridVisible = true;
        break;
      case 'MAIL':
        this.tabName = 'MAIL';
        this.isGridVisible = false;
        this.gridData = [];
        if (this.GridSelection == 'FirstGridData') {
        }
        break;
      default:
        this.tabName = this.tabName;
        return;
    }
    if (this.GridSelection === 'FirstGridData') {
      this.fetchGridData(this.tabName);
    } else {
      this.fetchSearchGridData(this.tabName);
    }
  }

  // Populate fields

  fillGeneralForm(row: any) {
    this.isModifyVisible = false;
    this.ModifyJobId = row.ID || null;
    this.JobId = row.JobID || null;

    if (this.tabName === 'CONTAINER') {
      this.ContainerID = row.ContID || null;
      this.isContModifyVisible = true;
      this.isContSaveVisible = false;
      this.isGridVisible = true;
      const containerFormValues: any = {};
      this.ContcontainerFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractContainerRowKey(fieldId);
        containerFormValues[fieldId] = row[key] ?? '';
      });
      this.ContcontainerForm.patchValue(containerFormValues);
    } else if (this.tabName === 'VESSEL') {
      this.VesselID = row.VesselID || null;
      this.isVesselModifyVisible = true;
      this.isVesselSaveVisible = false;
      this.isGridVisible = true;

      const vesselFormValues: any = {};
      const dateFields = ['Etd', 'Eta'];
      this.ContvesselFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractVesselRowKey(fieldId);
        vesselFormValues[fieldId] =
          dateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.ContvesselForm.patchValue(vesselFormValues);
    } else if (this.tabName === 'GENERAL') {
      this.isGridVisible = false;
      const CommonValues: any = {};
      this.commonFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractGeneralRowKey(fieldId);
        CommonValues[fieldId] = row[key] ?? '';
      });
      this.commonForm.patchValue(CommonValues);

      const formValues: any = {};
      const gendateFields = [
        'BookingDate',
        'BookingExpDt',
        'GateOpenDt',
        'VgmCutoffDt',
        'DocCutoffDt',
        'SiSubDt',
        'GateCutoffDt',
        'CfsInDt',
        'CfsOutDt',
      ];
      this.ContgeneralFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractGeneralRowKey(fieldId);
        formValues[fieldId] =
          gendateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.ContgeneralForm.patchValue(formValues);
    }
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^Cont_gen_/, '');
  }

  extractContainerRowKey(fieldId: string): string {
    return fieldId.replace(/^Cont_cont_/, '');
  }

  extractVesselRowKey(fieldId: string): string {
    return fieldId.replace(/^Cont_vess_/, '');
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

  //Clear Forms

  ClearAllForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.ContgeneralForm,
      containerForm: this.ContcontainerForm,
      vesselForm: this.ContvesselForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });

    this.fetchGridData('GENERAL');
    this.ModifyJobId = '';
    this.ContainerID = '';
    this.VesselID = '';
    this.isModifyVisible = false;
    this.ContainerfirstGridVisible = true;
    this.isTabPanelVisible = false;
    this.isGridVisible = false;
    this.mailBody = '';
    this.mailSubject = '';
    this.toMail = '';
    this.ccMail = '';
    this.getBookingNo();
    this.getCurrentDate();
  }

  ClearContainerForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      containerForm: this.ContcontainerForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.ContainerID = '';
    this.isContModifyVisible = false;
    if (this.GridSelection == 'FirstGridData') {
      this.isContSaveVisible = false;
    } else {
      this.isContSaveVisible = true;
    }
  }

  ClearVesselForm(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      vesselForm: this.ContvesselForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.VesselID = '';
    this.isVesselModifyVisible = false;
    if (this.GridSelection == 'FirstGridData') {
      this.isVesselSaveVisible = false;
    } else {
      this.isVesselSaveVisible = true;
    }
  }

  // Mail
  onGenerateMail() {
    const payload = {
      ContainerID: this.ModifyJobId,
      JobID: this.JobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
      MailOptions: this.selectedMailOption,
    };

    this.agentService.NVOCC_GenerateContainerBookingMail(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success') {
          this.mailSubject = res.ReturnSubject;
          this.sendMailBody = res.ReturnBody;
          this.mailBody = this.sanitizer.bypassSecurityTrustHtml(
            res.ReturnBody
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Mail Generated successfully',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to Generate Mail',
          });
        }
      },
      () => {}
    );
  }

  onSendMail() {
    this.isLoading = true;
    const payload = {
      AgentID: this.AgentID,
      CompanyID: this.CompanyId,
      MailBody: this.sendMailBody,
      ToMail: this.toMail,
      Subject: this.mailSubject,
      CCMail: this.ccMail,
    };
    this.agentService.NVOCC_SendMail(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Mail Sended Successfully',
          });
          this.isLoading = false;
          this.toMail = '';
          this.mailSubject = '';
          this.mailBody = '';
          this.ccMail = '';
        } else {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: `${res.Error}`,
          });
        }
      },
      () => {}
    );
  }
}
