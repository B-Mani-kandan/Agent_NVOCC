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
  HBL_GENERAL_FIELDS,
  HBL_COMMON_FIELDS,
  HBL_CARGO_FIELDS,
  HBL_FREIGHT_FIELDS,
  HBL_FREIGHTGRID_FIELDS,
  HBL_ANNEXUREGRID_FIELDS,
  HBL_CONTAINERGRID_FIELDS,
} from './hbl-draft-input-fields.config';
import { HBL_AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LoadContainerGridComponent } from '../../layout/load-container-grid/load-container-grid.component';
import { DynamicGridAddDeleteComponent } from '../../layout/dynamic-grid-add-delete/dynamic-grid-add-delete.component';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-hbl-draft',
  standalone: true,
  imports: [
    CommonModule,
    TabPanelComponent,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    DynamicGridAddDeleteComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './hbl-draft.component.html',
  styleUrl: './hbl-draft.component.css',
})
export class HblDraftComponent implements OnInit {
  CompanyId: string | undefined;
  CompID: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  AgentID: any | undefined;
  ModifyJobId: any | undefined;
  ModifyHBLID: any | undefined;
  ContainerID: any | undefined;
  GridSelection: any | undefined;
  hbl_tabName: string = 'GENERAL';
  IMPGENRAL: string = 'IMPGENERAL';
  hbl_tabLabels: string[] = [
    'GENERAL',
    'CARGO DETAILS',
    'FREIGHT DETAILS',
    'ANNEXURE DETAILS',
    'CONTAINER DETAILS',
  ];
  tabContents: TemplateRef<any>[] = [];
  hbl_CommonForm!: FormGroup;
  hbl_GeneralForm!: FormGroup;
  hbl_CargoForm!: FormGroup;
  hbl_FreightForm!: FormGroup;
  hbl_FreightGridForm!: FormGroup;

  gridData: any[] = [];
  gridImpContainerData: any[] = [];
  LoadGridData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  latestFreightGridData: any[] = [];
  latestAnnexureGridData: any[] = [];
  latestContainerGridData: any[] = [];
  currentActionMap: { linkid: string; label: string; icon: string }[] = [];

  hbl_CommonFields = HBL_COMMON_FIELDS;
  hbl_GeneralFields = HBL_GENERAL_FIELDS;
  hbl_CargoFields = HBL_CARGO_FIELDS;
  hbl_FreightFields = HBL_FREIGHT_FIELDS;

  HBL_FREIGHTGRID_FIELDS = HBL_FREIGHTGRID_FIELDS;
  HBL_ANNEXUREGRID_FIELDS = HBL_ANNEXUREGRID_FIELDS;
  HBL_CONTAINERGRID_FIELDS = HBL_CONTAINERGRID_FIELDS;

  importfirstGridVisible: boolean = true;
  isTabPanelVisible: boolean = false;
  isGridVisible: boolean = false;
  isModifyVisible: boolean = false;
  isContModifyVisible: boolean = false;
  searchClicked: boolean = false;

  ngOnInit() {
    this.hbl_CommonForm = this.createForm(this.hbl_CommonFields);
    this.hbl_GeneralForm = this.createForm(this.hbl_GeneralFields);
    this.hbl_CargoForm = this.createForm(this.hbl_CargoFields);
    this.hbl_FreightForm = this.createForm(this.hbl_FreightFields);
    this.hbl_FreightGridForm = this.createForm(this.HBL_FREIGHTGRID_FIELDS);
    this.setupAutocompleteListeners();
    this.PatchAdressValues();
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.CompID = localStorage.getItem('CompId') ?? undefined;
    this.FinanceYear = localStorage.getItem('FinanceYear') ?? undefined;
    this.BranchID = localStorage.getItem('BranchId') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.getJobNo();
    this.fetchGridData('GENERAL');
    this.IMPGENRAL = 'IMPGENERAL';
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  @ViewChild('HBL_COMMON', { static: false }) HBL_COMMON!: TemplateRef<any>;
  @ViewChild('HBL_GENERAL', { static: false }) HBL_GENERAL!: TemplateRef<any>;
  @ViewChild('HBL_CARGO', { static: false }) HBL_CARGO!: TemplateRef<any>;
  @ViewChild('HBL_FREIGHT', { static: false }) HBL_FREIGHT!: TemplateRef<any>;
  @ViewChild('HBL_ANNEXURE', { static: false }) HBL_ANNEXURE!: TemplateRef<any>;
  @ViewChild('HBL_CONTAINER', { static: false })
  HBL_CONTAINER!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @ViewChild('gridFreight') gridFreight!: DynamicGridAddDeleteComponent;
  @ViewChild('gridAnnexure') gridAnnexure!: DynamicGridAddDeleteComponent;
  @ViewChild('gridContainer') gridContainer!: DynamicGridAddDeleteComponent;

  ngAfterViewInit() {
    setTimeout(() => {
      if (
        this.HBL_GENERAL &&
        this.HBL_CARGO &&
        this.HBL_FREIGHT &&
        this.HBL_ANNEXURE &&
        this.HBL_CONTAINER
      ) {
        this.tabContents = [
          this.HBL_GENERAL,
          this.HBL_CARGO,
          this.HBL_FREIGHT,
          this.HBL_ANNEXURE,
          this.HBL_CONTAINER,
        ];
      }
    }, 0);
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

  PatchAdressValues(): void {
    this.hbl_GeneralForm
      .get('common_ShipperName')
      ?.valueChanges.subscribe((shipperName: string) => {
        if (shipperName && shipperName.trim() !== '') {
          this.fetchAndSetShipperAddress(shipperName);
        } else {
          this.hbl_GeneralForm.patchValue({ common_ShipperAddress: '' });
        }
      });

    this.hbl_GeneralForm
      .get('common_ConsigneeName')
      ?.valueChanges.subscribe((consigneeName: string) => {
        if (consigneeName && consigneeName.trim() !== '') {
          this.fetchAndSetConsigneeAddress(
            consigneeName,
            'common_ConsigneeAddress'
          );
        } else {
          this.hbl_GeneralForm.patchValue({ common_ConsigneeAddress: '' });
        }
      });

    this.hbl_GeneralForm
      .get('common_Notify_1Name')
      ?.valueChanges.subscribe((notifyName: string) => {
        if (notifyName && notifyName.trim() !== '') {
          this.fetchAndSetConsigneeAddress(
            notifyName,
            'common_Notify_1Address'
          );
        } else {
          this.hbl_GeneralForm.patchValue({ common_Notify_1Address: '' });
        }
      });

    this.hbl_GeneralForm
      .get('common_Notify_2Name')
      ?.valueChanges.subscribe((notifyName: string) => {
        if (notifyName && notifyName.trim() !== '') {
          this.fetchAndSetConsigneeAddress(
            notifyName,
            'common_Notify_2Address'
          );
        } else {
          this.hbl_GeneralForm.patchValue({ common_Notify_2Address: '' });
        }
      });
    this.hbl_GeneralForm
      .get('common_DestinationAgent')
      ?.valueChanges.subscribe((AgentName: string) => {
        if (AgentName && AgentName.trim() !== '') {
          this.fetchAndSetAgentAddress(
            AgentName,
            'common_DestinationAgentAddress'
          );
        } else {
          this.hbl_GeneralForm.patchValue({
            common_DestinationAgentAddress: '',
          });
        }
      });
    this.hbl_GeneralForm
      .get('common_ForwardingAgent')
      ?.valueChanges.subscribe((ForwadingName: string) => {
        if (ForwadingName && ForwadingName.trim() !== '') {
          this.fetchAndSetAgentAddress(
            ForwadingName,
            'common_ForwardingAgentAddress'
          );
        } else {
          this.hbl_GeneralForm.patchValue({
            common_ForwardingAgentAddress: '',
          });
        }
      });
  }

  getJobNo(): void {
    const payload = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.agentService.NVOCC_HBL_BLNo(payload).subscribe(
      (res) => {
        if (res?.Status === 'Success' && res.GetBLNo?.length > 0) {
          const BLNo = res.GetBLNo[0]?.BLNO;
          this.hbl_CommonForm.patchValue({
            common_BLNo: BLNo,
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
      HBL_COMMON: [
        'common_JobNo',
        'Imp_gen_Pod',
        'Imp_gen_Fpod',
        'Imp_gen_ItemDesc',
      ],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }
  setupAutocompleteListeners() {
    HBL_AUTOCOMPLETE_FIELDS.forEach(
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

  fetchNotifyName1Suggestions(
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

  fetchNotifyName2Suggestions(
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

  fetchDestinationAgentSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_AgentName',
      'AgentName',
      'AgentName',
      payloadType
    );
  }

  fetchForwardingAgentSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_AgentName',
      'AgentName',
      'AgentName',
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

  fetchCurrencySuggestions(
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

  fetchChargeNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_ChargeName',
      'ChargeName',
      'accountname',
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

  fetchPackageCodeSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_PackageCode',
      'GetPackageCode',
      'PackageCode',
      payloadType
    );
  }
  fetchIncoTermsSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetIncoTerms',
      'GetIncoTerms',
      'Term',
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
      const polValue = this.hbl_GeneralForm?.get('Imp_gen_Pol')?.value || '';
      country = polValue;
    } else if (payloadType === 'ContainerNo') {
      const Empty = this.hbl_GeneralForm?.get('Imp_gen_EmptyName')?.value;
      EmptyyardValue = Empty;
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
      ChargeName: {
        InputVal: input,
        CompanyId: this.CompanyId,
        CompID: this.CompID,
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
          this.hbl_GeneralForm.patchValue({
            common_ShipperAddress: res.ShipperAddress[0].Address,
          });
        }
      },
    });
  }

  fetchAndSetConsigneeAddress(consigneeName: string, targetField: string) {
    const payload = {
      ConsigneeName: consigneeName,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_GetConsigneeAddress(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && res.ConsigneeAddress?.length > 0) {
          this.hbl_GeneralForm.patchValue({
            [targetField]: res.ConsigneeAddress[0].Address,
          });
        }
      },
      error: (err) => {
        this.hbl_GeneralForm.patchValue({ [targetField]: '' });
      },
    });
  }

  fetchAndSetAgentAddress(AgentName: string, targetField: string) {
    const payload = {
      AgentName: AgentName,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_GetAgentAddress(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && res.Address) {
          this.hbl_GeneralForm.patchValue({
            [targetField]: res.Address,
          });
        }
      },
      error: (err) => {
        this.hbl_GeneralForm.patchValue({ [targetField]: '' });
      },
    });
  }

  onSearch() {
    this.importfirstGridVisible = false;
    this.isTabPanelVisible = false;
    this.isGridVisible = true;
    this.fetchSearchGridData('GENERAL');
  }

  HandleRowActionFirstGrid(event: { action: string; data: any }) {
    this.ModifyJobId = event.data.ID;
    this.ModifyHBLID = '';
    this.GridSelection = 'FirstGridData';
    this.importfirstGridVisible = false;
    this.isTabPanelVisible = true;
    this.isGridVisible = false;
    this.getJobNo();
    this.fillGeneralForm(event.data);
  }

  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.GridSelection = 'SecondGridData';
      this.ModifyHBLID = event.data.HBLID;
      this.ModifyJobId = event.data.ID;
      this.isTabPanelVisible = true;
      this.importfirstGridVisible = false;
      this.isGridVisible = false;
      this.fillGeneralForm(event.data);
      this.fetchFreightGridData();
      this.fetchAnnexureGridData();
      this.fetchContainerGridData();
      this.isModifyVisible = true;
    } else {
      this.handleGeneralTabDownload(event.action, event.data);
    }
    this.GridSelection = 'SecondGridData';
  }

  private handleGeneralTabDownload(action: string, data: any) {
    if (
      (action === 'BLSet' || action === 'NonNegotiable') &&
      data.Final !== 'Y'
    ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Failed',
        detail: 'BL Not Approved as Final',
      });
      return;
    }

    const payload = {
      BLType: action,
      Final: data.Final,
      BLID: data.HBLID,
      Stat: 'N',
      FileType: 'PDF',
      ViewOrMail: 'VIEW',
      CompanyID: this.CompanyId,
      CompID: this.CompID,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    Swal.fire({
      title: `Are you sure you want to download ${action} Print?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, download it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agentService.fetchHBLGeneralActionFile(action, payload).subscribe(
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
      GENERAL: ['select', 'JobNo', 'JobDate', 'POL', 'POD'],
    };

    const payload = {
      JobID: this.ModifyJobId,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      AgentID: this.AgentID,
      FinanceYear: this.FinanceYear,
    };

    this.agentService.fetchHBLExPortConvertGridData(tab, payload).subscribe(
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
        'BLNo',
        'JobNo',
        'ShipperName',
        'ConsigneeName',
        'POL',
        'POD',
        'actions',
      ],
    };

    const actionMap: any = {
      GENERAL: [
        { linkid: 'BLDraft', label: 'BL Draft/Original', icon: 'description' },
        { linkid: 'NonNegotiable', label: 'Non-Negotiable', icon: 'gavel' },
        { linkid: 'BLSet', label: 'BL Set', icon: 'inventory_2' },
      ],
    };

    const payload = {
      AgentID: this.AgentID,
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
    };

    this.agentService.fetchHBLAllDetails(tab, payload).subscribe(
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

  fetchFreightGridData() {
    const payload = { HBLID: this.ModifyHBLID };
    this.agentService.fetchFreightGridData(payload).subscribe((res: any) => {
      if (res.Status === 'Success' && res.ShowFreightGridDetails) {
        this.latestFreightGridData = res.ShowFreightGridDetails;
        this.gridFreight?.setGridRows(this.latestFreightGridData);
      } else {
        this.latestFreightGridData = [];
        this.gridFreight?.setGridRows([]);
      }
    });
  }
  fetchAnnexureGridData() {
    const payload = { HBLID: this.ModifyHBLID, CompanyID: this.CompanyId };
    this.agentService.fetchAnnexureGridData(payload).subscribe((res: any) => {
      if (res.Status === 'Success' && res.ShowAnnexureGridDetails) {
        this.latestAnnexureGridData = res.ShowAnnexureGridDetails;
        this.gridAnnexure?.setGridRows(this.latestAnnexureGridData);
      } else {
        this.latestAnnexureGridData = [];
        this.gridAnnexure?.setGridRows([]);
      }
    });
  }

  fetchContainerGridData() {
    const payload = { HBLID: this.ModifyHBLID, CompanyID: this.CompanyId };

    this.agentService
      .fetchHBLContainerGridData(payload)
      .subscribe((res: any) => {
        if (res.Status === 'Success' && res.ShowContainerGridDetails) {
          this.latestContainerGridData = res.ShowContainerGridDetails;
          this.gridContainer?.setGridRows(this.latestContainerGridData);
        } else {
          this.latestContainerGridData = [];
          this.gridContainer?.setGridRows([]);
        }
      });
  }

  loadApproverName(): void {
    let payload: any;
    payload = { CompanyId: this.CompanyId };
    this.agentService.NVOCC_GetApproverName(payload).subscribe({
      next: (res: any) => {
        if (res?.Status === 'Success' && Array.isArray(res.GetApproverName)) {
          const options = res.GetApproverName.map(
            (item: any) => item.employeeyName
          );

          const ApproverField = this.hbl_FreightFields.find(
            (f) => f.id === 'common_Approver'
          );
          if (ApproverField) {
            ApproverField.options = options;
          }
        }
      },
    });
  }

  onFreightGridDataChange(data: any[]) {
    if (!this.latestFreightGridData) {
      this.latestFreightGridData = [];
    }
    this.latestFreightGridData.length = 0;
    this.latestFreightGridData.push(...data);
  }

  onAnnexureGridDataChange(data: any[]) {
    if (!this.latestAnnexureGridData) {
      this.latestAnnexureGridData = [];
    }
    this.latestAnnexureGridData.length = 0;
    this.latestAnnexureGridData.push(...data);
  }
  onContainerGridDataChange(data: any[]) {
    if (!this.latestContainerGridData) {
      this.latestContainerGridData = [];
    }
    this.latestContainerGridData.length = 0;
    this.latestContainerGridData.push(...data);
  }

  onTabChange(tabIndex: number): void {
    this.hbl_tabName = this.hbl_tabLabels[tabIndex];
    switch (this.hbl_tabName) {
      case 'GENERAL':
        this.hbl_tabName = 'GENERAL';
        this.isGridVisible = false;
        this.gridData = [];
        break;
      case 'CARGO DETAILS':
        this.hbl_tabName = 'CARGO';
        this.isGridVisible = false;
        break;
      case 'FREIGHT DETAILS':
        this.hbl_tabName = 'FREIGHT';
        this.isGridVisible = false;
        this.fetchFreightGridData();
        this.loadApproverName();
        break;
      case 'ANNEXURE DETAILS':
        this.hbl_tabName = 'ANNEXURE';
        this.isGridVisible = false;
        this.fetchAnnexureGridData();
        break;
      case 'CONTAINER DETAILS':
        this.hbl_tabName = 'CONTAINER';
        this.isGridVisible = false;
        this.fetchContainerGridData();
        break;
      default:
        this.hbl_tabName = this.hbl_tabName;
        return;
    }
    if (this.GridSelection === 'FirstGridData') {
      this.fetchGridData(this.hbl_tabName);
    } else {
      this.fetchSearchGridData(this.hbl_tabName);
    }
  }

  // Populate fields
  fillGeneralForm(row: any) {
    this.isModifyVisible = false;
    this.ModifyJobId = row.ID || null;

    const CommonValues: any = {};
    this.hbl_CommonFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractCommonRowKey(fieldId);
      CommonValues[fieldId] = row[key] ?? '';
    });
    this.hbl_CommonForm.patchValue(CommonValues);

    const formValues: any = {};
    this.hbl_GeneralFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractCommonRowKey(fieldId);
      formValues[fieldId] = row[key] ?? '';
    });
    this.hbl_GeneralForm.patchValue(formValues);

    const CargoFormValues: any = {};
    const dateFields = ['ETD', 'ETA', 'InvoiceDate', 'SBDate'];
    this.hbl_CargoFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractCommonRowKey(fieldId);
      CargoFormValues[fieldId] =
        dateFields.includes(key) && row[key]
          ? this.convertToDateInputFormat(row[key])
          : row[key] ?? '';
    });
    this.hbl_CargoForm.patchValue(CargoFormValues);

    const FreightFormValues: any = {};
    const FreightdateFields = ['DateOfIssue', 'OnBoardDate'];

    this.hbl_FreightFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractCommonRowKey(fieldId);

      let value = row[key] ?? '';
      if (FreightdateFields.includes(key) && row[key]) {
        value = this.convertToDateInputFormat(row[key]);
      }
      if (field.type === 'checkbox') {
        value = row[key] === 'Y' ? true : false;
      }

      FreightFormValues[fieldId] = value;
    });

    this.hbl_FreightForm.patchValue(FreightFormValues);
  }

  extractCommonRowKey(fieldId: string): string {
    return fieldId.replace(/^common_/, '');
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
            detail: `${this.capitalize(this.hbl_tabName)} ${res.Message}`,
          });
          onSuccess?.(res);
          this.fetchSearchGridData(this.hbl_tabName);
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
    if (!this.validateMandatoryFields(this.hbl_GeneralForm, 'GENERAL')) return;

    const baseData = {
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
      Nvocc_AgentID: localStorage.getItem('AgentID'),
      JobID: this.ModifyJobId,
      HBLID: this.ModifyHBLID,
    };

    const combinedPayload = {
      ...this.hbl_CommonForm.getRawValue(),
      ...this.hbl_GeneralForm.getRawValue(),
      ...this.hbl_CargoForm.getRawValue(),
      ...this.hbl_FreightForm.getRawValue(),
      ...baseData,
    };

    this.agentService.NVOCC_SaveAllForms_HBLDraft(combinedPayload).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `General ${res.Message}`,
          });

          this.ModifyHBLID = res.ReturnBLID;
          this.ModifyJobId = res.ReturnJobID;
          this.isModifyVisible = true;

          if (callback) callback();

          this.fetchSearchGridData(this.hbl_tabName);
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
        HBLID: this.ModifyHBLID,
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

  onSaveFreightGrid(action: any): void {
    const payload = {
      FreightDetails: this.buildGridPayload(
        this.latestFreightGridData,
        this.HBL_FREIGHTGRID_FIELDS,
        action
      ),
    };
    this.agentService.NVOCC_Save_HBL_FreightGrid(payload).subscribe();
  }

  onSaveAnnexureGrid(action: any): void {
    const payload = {
      AnnexureDetails: this.buildGridPayload(
        this.latestAnnexureGridData,
        this.HBL_ANNEXUREGRID_FIELDS,
        action
      ),
    };
    this.agentService.NVOCC_Save_HBL_AnnexureGrid(payload).subscribe();
  }

  onSaveContainerGrid(action: any): void {
    const payload = {
      ContainerDetails: this.buildGridPayload(
        this.latestContainerGridData,
        this.HBL_CONTAINERGRID_FIELDS,
        action
      ),
    };
    this.agentService.NVOCC_Save_HBL_ContainerGrid(payload).subscribe();
  }

  onSave(action: any) {
    this.OnGeneralSave(() => {
      this.onSaveFreightGrid(action);
      this.onSaveAnnexureGrid(action);
      this.onSaveContainerGrid(action);
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  onDeleteRow(event: { index: number; row: any; gridType?: string }) {
    const { row, gridType } = event;

    const idKey = this.getIdKey(row);
    const idValue = row[idKey];

    if (!idValue) {
      return;
    }

    const type = gridType || this.detectGridType(idKey);

    const payload = {
      GridType: type,
      ID: idValue,
      CompanyID: this.CompanyId,
    };

    this.agentService.NVOCC_HBL_AllGridDelete(payload).subscribe((res: any) => {
      if (res.Status === 'Sucess') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${type} row Deleted SuccessFully`,
        });
        console.log();
      }
    });
  }

  // Detect GridType based on ID key
  private detectGridType(idKey: string): string {
    if (/FreightID/i.test(idKey)) return 'FREIGHT';
    if (/AnnexureID/i.test(idKey)) return 'ANNEXURE';
    if (/ContainerID/i.test(idKey)) return 'CONTAINER';
    return 'UNKNOWN';
  }

  //Clear Forms

  ClearAllForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.hbl_GeneralForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.latestFreightGridData = [];
    this.latestAnnexureGridData = [];
    this.latestContainerGridData = [];
    this.ModifyJobId = '';
    this.ContainerID = '';
    this.isModifyVisible = false;
    this.importfirstGridVisible = true;
    this.isTabPanelVisible = false;
    this.isGridVisible = false;
    this.getJobNo();
    this.fetchGridData('GENERAL');
  }

  openContainerPopup(data: any[]) {
    const dialogRef = this.dialog.open(LoadContainerGridComponent, {
      width: '800px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.length > 0) {
        console.log('User selected containers:', result);
      }
    });
  }
}
