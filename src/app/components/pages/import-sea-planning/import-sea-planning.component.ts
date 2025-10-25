import {
  Component,
  TemplateRef,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
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
  COMMON_FIELDS,
  IMP_GENERAL_FIELDS,
  IMP_PRINT_FIELDS,
  IMP_VESSEL_FIELDS,
  IMP_CONTAINER_FIELDS,
  IMP_GENERAL_GRID,
} from './import-sea-input-fields.config';
import { IMP_AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LoadContainerGridComponent } from '../../layout/load-container-grid/load-container-grid.component';
import { DynamicGridAddDeleteComponent } from '../../layout/dynamic-grid-add-delete/dynamic-grid-add-delete.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-import-sea-planning',
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    DynamicGridAddDeleteComponent,
    TabPanelComponent,
    ToastModule,
    MatIconModule,
    FormsModule,
    LoaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './import-sea-planning.component.html',
  styleUrl: './import-sea-planning.component.css',
})
export class ImportSeaPlanningComponent implements OnInit {
  CompanyId: string | undefined;
  AgentID: any | undefined;
  BranchID: any | undefined;
  FinanceYear: any | undefined;
  CompID: any | undefined;
  ExpJobId: any | undefined;
  ModifyJobId: any | undefined;
  GridContExpJobID: any | undefined;
  CTrackId: any | undefined;
  NVOCContId: any | undefined;
  VesselID: any | undefined;
  ContainerID: any | undefined;
  GridSelection: any | undefined;
  Imp_tabName: string = 'GENERAL';
  IMPGENRAL: string = 'IMPGENERAL';
  Imp_tabLabels: string[] = [
    'GENERAL',
    'CONTAINER DETAILS',
    'VESSEL DETAILS',
    'MAIL',
  ];
  tabContents: TemplateRef<any>[] = [];
  commonForm!: FormGroup;
  imp_GeneralForm!: FormGroup;
  imp_Gen_PrintForm!: FormGroup;
  imp_ContainerForm!: FormGroup;
  imp_VesselForm!: FormGroup;
  gridData: any[] = [];
  PopupLoadGriddata: any[] = [];
  gridImpContainerData: any[] = [];
  LoadGridData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];
  latestImpContGridData: any[] = [];
  currentActionMap: { linkid: string; label: string; icon: string }[] = [];
  commonFields = COMMON_FIELDS;
  imp_GeneralFields = IMP_GENERAL_FIELDS;
  imp_Gen_PrintFields = IMP_PRINT_FIELDS;
  imp_ContainerFields = IMP_CONTAINER_FIELDS;
  imp_VesselFields = IMP_VESSEL_FIELDS;
  IMP_GENERAL_GRID = IMP_GENERAL_GRID;
  importfirstGridVisible: boolean = true;
  isTabPanelVisible: boolean = false;
  isGridVisible: boolean = false;
  isModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  isVesselModifyVisible: boolean = false;
  searchClicked: boolean = false;
  extraFieldsVisible: boolean = false;
  HIDEGRIDACTION = 'HIDEGRIDACTION';
  isLoading = false;
  //Mail
  mailFields = [
    {
      label: 'Cargo Arrival Notification',
      value: 'Cargo Arrival Notification',
    },
    { label: 'Delivery Order Details', value: 'Delivery Order Details' },
    { label: 'Job Booking Confirmation', value: 'Job Booking Confirmation' },
  ];
  selectedMailOption: string = 'Cargo Arrival Notification';
  mailSubject: string = '';
  toMail: string = '';
  ccMail: string = '';
  mailBody: SafeHtml = '';
  sendMailBody: string = '';

  ngOnInit() {
    this.commonForm = this.createForm(this.commonFields);
    this.imp_GeneralForm = this.createForm(this.imp_GeneralFields);
    this.imp_Gen_PrintForm = this.createForm(this.imp_Gen_PrintFields);
    this.imp_ContainerForm = this.createForm(this.imp_ContainerFields);
    this.imp_VesselForm = this.createForm(this.imp_VesselFields);
    this.setupAutocompleteListeners();
    this.PatchAdressValues();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.getJobNo();
    this.getCurrentDate();
    this.fetchGridData('GENERAL');
    this.IMPGENRAL = 'IMPGENERAL';
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService,
    private http: HttpClient,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  @ViewChild('IMP_GENERAL', { static: false }) IMP_GENERAL!: TemplateRef<any>;
  @ViewChild('IMP_CONTAINER', { static: false })
  IMP_CONTAINER!: TemplateRef<any>;
  @ViewChild('IMP_VESSEL', { static: false }) IMP_VESSEL!: TemplateRef<any>;
  @ViewChild('MAIL', { static: false }) MAIL!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @ViewChild('gridImpCont') gridImpCont!: DynamicGridAddDeleteComponent;
  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.IMP_GENERAL &&
        this.IMP_CONTAINER &&
        this.IMP_VESSEL &&
        this.MAIL
      ) {
        this.tabContents = [
          this.IMP_GENERAL,
          this.IMP_CONTAINER,
          this.IMP_VESSEL,
          this.MAIL,
        ];
      }
    }, 0);
  }

  PatchAdressValues(): void {
    this.imp_Gen_PrintForm
      .get('Imp_gen_ShipperName')
      ?.valueChanges.subscribe((shipperName: string) => {
        if (shipperName && shipperName.trim() !== '') {
          this.fetchAndSetShipperAddress(shipperName);
        } else {
          this.imp_Gen_PrintForm.patchValue({ Imp_gen_ShipperAddress: '' });
        }
      });

    this.imp_Gen_PrintForm
      .get('Imp_gen_Consignee')
      ?.valueChanges.subscribe((consigneeName: string) => {
        if (consigneeName && consigneeName.trim() !== '') {
          this.fetchAndSetConsigneeAddress(consigneeName);
        } else {
          this.imp_Gen_PrintForm.patchValue({ Imp_gen_ConsigneeAddress: '' });
        }
      });

    this.imp_ContainerForm
      .get('Imp_cont_EmptyName')
      ?.valueChanges.subscribe((EmptyYardName: string) => {
        if (EmptyYardName && EmptyYardName.trim() !== '') {
          this.fetchAndSetEmptyYardAddress(EmptyYardName);
        } else {
          this.imp_ContainerForm.patchValue({ Imp_gen_EmptyYardAddress: '' });
        }
      });
  }

  saveForm(data: any) {}
  createForm(fields: any[]): FormGroup {
    let group: any = {};
    fields.forEach((field) => {
      if (field.type === 'checkbox') {
        group[field.id] = new FormControl(false);
      } else {
        group[field.id] = new FormControl('');
      }
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
      AgentID: this.AgentID,
    };

    this.agentService.NVOCC_Import_GetJobNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetImpJobNo?.length > 0) {
          const jobNo = res.GetImpJobNo[0]?.orderno;
          this.commonForm.patchValue({
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

  toggleExtraFields(): void {
    this.extraFieldsVisible = !this.extraFieldsVisible;
  }
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [
        'Imp_gen_JobNo',
        'Imp_gen_Pol',
        'Imp_gen_Pod',
        'Imp_gen_Fpod',
        'Imp_gen_ItemDesc',
        'Imp_gen_InwardDate',
      ],
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

  fetchShipperNameSuggestions(
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

  fetchConsigneeNameSuggestions(
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

  fetchContainerTypeSuggestions(
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

  fetchCHANameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetCHAName',
      'GetCHAName',
      'AccountName',
      payloadType
    );
  }

  fetchUnitTypeSuggestions(
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

  fetchPackageTypeSuggestions(
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

  fetchDeStuffPlaceSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetDeStuffPlace',
      'GetDestuffPlace',
      'AccountName',
      payloadType
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
      const polValue = this.imp_GeneralForm?.get('Imp_gen_Pod')?.value || '';
      country = polValue;
    } else if (payloadType === 'ContainerNo') {
      const Empty = this.imp_ContainerForm?.get('Imp_cont_EmptyName')?.value;
      const contsize = this.imp_ContainerForm?.get(
        'Imp_cont_ContainerSize'
      )?.value;
      EmptyyardValue = Empty;
      Contsize = contsize;
      if (Contsize == '' || Contsize == null) {
        this.messageService.add({
          severity: 'warn',
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

  fetchGridAutocomplete = (
    method: string,
    input: string,
    payloadType: string
  ) => {
    return (this as any)[method](input, payloadType);
  };

  fetchAndSetShipperAddress(ShipperName: string) {
    const payload = {
      ShipperName: ShipperName,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_GetShipperAddress(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && res.ShipperAddress?.length > 0) {
          this.imp_Gen_PrintForm.patchValue({
            Imp_gen_ShipperAddress: res.ShipperAddress[0].Address,
          });
        }
      },
    });
  }

  fetchAndSetConsigneeAddress(consigneeName: string) {
    const payload = {
      ConsigneeName: consigneeName,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_GetConsigneeAddress(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && res.ConsigneeAddress?.length > 0) {
          this.imp_Gen_PrintForm.patchValue({
            Imp_gen_ConsigneeAddress: res.ConsigneeAddress[0].Address,
          });
        }
      },
    });
  }

  fetchAndSetEmptyYardAddress(EmptyyardName: string) {
    const payload = {
      EmptyYardName: EmptyyardName,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_GetEmptyYardAddress(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && res.EmptyYardAddress?.length > 0) {
          this.imp_ContainerForm.patchValue({
            Imp_gen_EmptyYardAddress: res.EmptyYardAddress[0].Addres,
          });
        }
      },
    });
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

          const containerSizeField = this.imp_ContainerFields.find(
            (f) => f.id === 'Imp_cont_ContainerSize'
          );
          if (containerSizeField) {
            containerSizeField.options = options;
          }
        }
      },
    });
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
    this.GridSelection = 'FirstGridData';
    this.fillGeneralForm(event.data);
    this.importfirstGridVisible = false;
    this.isTabPanelVisible = true;
    this.isGridVisible = false;
    this.getJobNo();
    this.getCurrentDate();
  }

  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.GridSelection = 'SecondGridData';
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
      AgentID: this.AgentID,
      JobID: data.ID,
    };

    if (action === 'Empty' || action === 'Surveyor') {
      this.agentService
        .NVOCC_LoadContainerDetails_Print(payload)
        .subscribe((resp: any) => {
          if (resp.Status === 'Success') {
            this.LoadGridData = new MatTableDataSource(
              resp.LoadContainerDetails || []
            );
            this.PopupLoadGriddata = resp.LoadContainerDetails;
            this.openContainerPopup(resp.LoadContainerDetails || []);
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Failed',
              detail: 'There is No Data in Container Details',
            });
            this.LoadGridData = new MatTableDataSource<any>([]);
            this.PopupLoadGriddata = [];
          }
        });
    } else {
      Swal.fire({
        title: `Are you sure you want to download ${action} Print?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, download it!',
        cancelButtonText: 'No, cancel',
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
      GENERAL: ['select', 'JobNo', 'JobDate', 'Pol', 'Pod', 'HblNo', 'MblNo'],
      CONTAINER: ['ContainerNo', 'ContainerSize'],
      VESSEL: ['POL', 'POD', 'VesselName', 'Eta', 'Etd'],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
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
        'Pol',
        'Pod',
        'HblNo',
        'MblNo',
        'actions',
      ],
      CONTAINER: ['select', 'ContainerNo', 'ContainerSize'],
      VESSEL: ['select', 'POL', 'POD', 'VesselName', 'Eta', 'Etd'],
    };

    const actionMap: any = {
      GENERAL: [
        { linkid: 'CAN', label: 'CAN', icon: 'description' },
        { linkid: 'DO', label: 'DO', icon: 'assignment_turned_in' },
        { linkid: 'Empty', label: 'Empty', icon: 'inventory_2' },
      ],
    };

    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
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
        this.gridData = [];
        this.displayedColumns = [];
        this.currentActionMap = [];
        this.isGridVisible = false;
      }
    );
  }

  onExpContGridDataChange(data: any[]) {
    if (!this.latestImpContGridData) {
      this.latestImpContGridData = [];
    }
    this.latestImpContGridData.length = 0;
    this.latestImpContGridData.push(...data);
  }

  fetchContainerGridData() {
    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
    };

    if (this.Imp_tabName === 'GENERAL') {
      this.agentService
        .fetchContainerGridAddDeleteData(payload)
        .subscribe((res: any) => {
          if (res.Status === 'Success') {
            this.latestImpContGridData = res.ShowGridContainerDetails;
            this.gridImpCont?.setGridRows(this.latestImpContGridData);
          } else {
            this.latestImpContGridData = [];
            this.gridImpCont?.setGridRows([]);
          }
        });
    }
  }

  fetchImpContainerGridData() {
    const payload = {
      EDIJobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
    };

    if (this.Imp_tabName === 'GENERAL') {
      this.agentService
        .fetchImpContainerGridAddDeleteData(payload)
        .subscribe((res: any) => {
          if (res.Status === 'Success') {
            this.latestImpContGridData = res.ShowGridContainerDetails;
            this.gridImpCont?.setGridRows(this.latestImpContGridData);
          } else {
            this.latestImpContGridData = [];
            this.gridImpCont?.setGridRows([]);
          }
        });
    }
  }

  onTabChange(tabIndex: number): void {
    this.Imp_tabName = this.Imp_tabLabels[tabIndex];
    switch (this.Imp_tabName) {
      case 'GENERAL':
        this.Imp_tabName = 'GENERAL';
        this.isGridVisible = false;
        this.gridData = [];
        break;
      case 'CONTAINER DETAILS':
        this.Imp_tabName = 'CONTAINER';
        this.isGridVisible = true;
        this.loadContainerSizes();
        break;
      case 'VESSEL DETAILS':
        this.Imp_tabName = 'VESSEL';
        this.isGridVisible = true;
        break;
      case 'MAIL':
        this.Imp_tabName = 'MAIL';
        this.isGridVisible = false;
        this.gridData = [];
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
    this.ExpJobId = row.ExpID || null;
    this.BranchID = row.BranchID || null;
    this.FinanceYear = row.FinanceYear || null;
    this.CompID = row.CompID || null;

    if (this.Imp_tabName === 'CONTAINER') {
      this.ContainerID = row.ContID || null;
      this.CTrackId = row.CTrackId || null;
      this.NVOCContId = row.NVOCCon_Id || null;
      this.isContModifyVisible = true;
      this.isGridVisible = true;

      const containerFormValues: any = {};
      const dateFields = ['EmptyReturnDate', 'ValidDate'];

      this.imp_ContainerFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractContainerRowKey(fieldId);
        let value = row[key] ?? '';
        if (dateFields.includes(key) && row[key]) {
          value = this.convertToDateInputFormat(row[key]);
        }
        if (field.type === 'checkbox') {
          value = row[key] === 'Y' ? true : false;
        }
        containerFormValues[fieldId] = value;
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
      const CommonValues: any = {};
      this.commonFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractGeneralRowKey(fieldId);
        CommonValues[fieldId] = row[key] ?? '';
      });
      this.commonForm.patchValue(CommonValues);
      const formValues: any = {};
      const gendateFields = [
        'JobDate',
        'MblDate',
        'HblDate',
        'InwardDate',
        'DoValidDate',
        'DODate',
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

      const extraFormValues: any = {};
      const extradateFields = ['CANDate', 'InvoiceDate', 'IGMDate'];
      this.imp_Gen_PrintFields.forEach((field) => {
        const fieldId = field.id;
        const key = this.extractGeneralRowKey(fieldId);
        extraFormValues[fieldId] =
          extradateFields.includes(key) && row[key]
            ? this.convertToDateInputFormat(row[key])
            : row[key] ?? '';
      });
      this.imp_Gen_PrintForm.patchValue(extraFormValues);
      this.imp_VesselForm.patchValue({
        Imp_vess_POL: this.imp_GeneralForm?.get('Imp_gen_Pol')?.value || '',
        Imp_vess_POD: this.imp_GeneralForm?.get('Imp_gen_Pod')?.value || '',
      });

      if (this.GridSelection === 'FirstGridData') {
        if (this.ModifyJobId) {
          this.fetchImpContainerGridData();
        }
      } else {
        if (this.ModifyJobId) {
          this.fetchContainerGridData();
        }
      }
    }
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^Imp_gen_/, '');
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
    const missingFields: string[] = [];

    Object.keys(formGroup.controls).forEach((fieldId) => {
      if (isMandatory(fieldId)) {
        const control = formGroup.get(fieldId);
        if (!control?.value || control.value.toString().trim() === '') {
          control?.markAsTouched();
          allValid = false;
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

  OnGeneralSave(callback?: () => void): void {
    if (!this.validateMandatoryFields(this.imp_GeneralForm, 'GENERAL')) return;

    let data: any;
    if (this.GridSelection === 'FirstGridData') {
      data = {
        ExpSave: 'Y',
        CompanyID: this.CompanyId,
        Nvocc_AgentID: this.AgentID,
        JobID: this.ModifyJobId,
        EDIJOBID: '',
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
        CompID: this.CompID,
      };
    } else {
      data = {
        ExpSave: 'N',
        CompanyID: this.CompanyId,
        Nvocc_AgentID: this.AgentID,
        EDIJOBID: this.ModifyJobId,
        JobID: this.ExpJobId,
        FinanceYear: this.FinanceYear,
        BranchID: this.BranchID,
        CompID: this.CompID,
      };
    }

    const combinedPayload = {
      ...this.commonForm.getRawValue(),
      ...this.imp_GeneralForm.getRawValue(),
      ...this.imp_Gen_PrintForm.getRawValue(),
      ...data,
    };

    this.agentService
      .NVOCC_SaveAllForms_ImportSea_General(combinedPayload)
      .subscribe({
        next: (res) => {
          if (res.Status === 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `General ${res.Message}`,
            });
            this.ModifyJobId = res.ReturnJobID;
            this.isModifyVisible = true;
            if (callback) callback();
            this.GridSelection = 'SecondGrid';
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

  OnContainerSave(action: any): void {
    if (!this.validateMandatoryFields(this.imp_ContainerForm, 'CONTAINER'))
      return;
    const genEmptyName = this.imp_GeneralForm.get('gen_EmptyName')?.value;
    const data = {
      SavedJobID: this.ModifyJobId,
      ContainerID: action === 'Modify' ? this.ContainerID : '',
      CTrackId: action === 'Modify' ? this.CTrackId : '',
      NVOCContId: action === 'Modify' ? this.NVOCContId : '',
      CompanyID: this.CompanyId,
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

  private getIdKey(row: any): string {
    return (
      Object.keys(row).find((k) =>
        /(FreightID|AnnexureID|ContainerID|ID)$/i.test(k)
      ) || 'ID'
    );
  }
  private buildGridPayload(
    rows: any[],
    fields: any[],
    action: string,
    extra: any = {}
  ): any[] {
    return rows.map((row) => {
      const rowPayload: any = {
        JobID: this.ModifyJobId,
        CompanyID: this.CompanyId,
        ...extra,
      };

      const idKey = this.getIdKey(row);
      rowPayload['ID'] = action === 'Modify' ? row[idKey] : '';

      fields.forEach((field: any) => {
        rowPayload[field.id] = row[field.id] ?? '';
      });

      return rowPayload;
    });
  }

  OnContGridDetailsSave(action: any): void {
    const payload = {
      ContainerDetails: this.buildGridPayload(
        this.latestImpContGridData,
        this.IMP_GENERAL_GRID,
        action
      ),
    };
    this.agentService
      .NVOCC_Save_ExportSea_GridContainerDetails(payload)
      .subscribe();
  }

  onSave(action: any) {
    this.OnGeneralSave(() => {
      this.OnContGridDetailsSave(action);
    });
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

  onDeleteRow(event: { index: number; row: any }) {
    const { row } = event;

    if (row.ID) {
      const payload = {
        ContainerID: row.ID,
        CompanyID: this.CompanyId,
      };

      this.agentService
        .NVOCC_Delete_ExportSea_GridContainerDetails(payload)
        .subscribe((res: any) => {
          if (res.Status === 'Sucess') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Container Deleted Successfully`,
            });
          }
        });
    }
  }

  //Clear Forms

  ClearAllForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.imp_GeneralForm,
      generalPrintForm: this.imp_Gen_PrintForm,
      containerForm: this.imp_ContainerForm,
      vesselForm: this.imp_VesselForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.latestImpContGridData = [];
    this.ModifyJobId = '';
    this.ContainerID = '';
    this.VesselID = '';
    this.isModifyVisible = false;
    this.importfirstGridVisible = true;
    this.isTabPanelVisible = false;
    this.isGridVisible = false;
    this.mailBody = '';
    this.mailSubject = '';
    this.toMail = '';
    this.ccMail = '';
    this.getJobNo();
    this.getCurrentDate();
    this.fetchGridData('GENERAL');
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
  openContainerPopup(data: any[]) {
    const dialogRef = this.dialog.open(LoadContainerGridComponent, {
      width: '800px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result: any[]) => {
      if (result && result.length === 0) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation',
          detail: 'Please select at least one container',
        });
        this.openContainerPopup(this.PopupLoadGriddata);
        return;
      }

      if (result && result.length > 0) {
        const contIds = result.map((r) => r.ContID).join(',');

        const payload = {
          JobId: result[0]?.JobID,
          ContID: contIds,
          PrintType: 'Empty',
          CompanyID: this.CompanyId,
          AgentID: this.AgentID,
        };

        this.agentService.fetchGeneralActionFile('Empty', payload).subscribe(
          (resp: any) => {
            if (resp && resp.File) {
              this.downloadPdf(resp.File, 'Empty.pdf');
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: 'Empty Print No Data Found',
              });
            }
          },
          (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: error?.Message || 'No Data Found',
            });
          }
        );
      }
    });
  }

  //mail Below
  onGenerateMail() {
    const payload = {
      JobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
      Type: 'Import',
      MailOptions: this.selectedMailOption,
    };

    this.agentService.NVOCC_GenerateMail(payload).subscribe(
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
