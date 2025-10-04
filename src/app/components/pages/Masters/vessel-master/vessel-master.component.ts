import {
  Component,
  ViewChild,
  Output,
  OnInit,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { AgentService } from '../../../../services/agent.service';
import { DynamicFormsComponent } from '../../../layout/dynamic-forms/dynamic-forms.component';
import { DynamicGridviewComponent } from '../../../layout/dynamic-gridview/dynamic-gridview.component';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AUTOCOMPLETE_FIELDS } from '../client-master/autocomplete-fields.config';
import { GENERAL_FIELDS } from './vessel-master-input-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-vessel-master',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './vessel-master.component.html',
  styleUrl: './vessel-master.component.css',
})
export class VesselMasterComponent implements OnInit {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  ModifyVesselId: any | undefined;
  CompID: any | undefined;
  AgentID: any | undefined;
  tabName: string = 'GENERAL';
  generalForm!: FormGroup;
  gridData: any[] = [];
  displayedColumns: string[] = [];
  isModifyVisible: boolean = false;
  isFormVisible: boolean = true;
  isGridVisible: boolean = false;
  selectedColumns: string[] = [];
  generalFields = GENERAL_FIELDS;
  IMPGENRAL: string = 'IMPGENERAL';

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();

  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.generalForm = this.createForm(this.generalFields);
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.CompID = localStorage.getItem('CompId') ?? undefined;
    this.FinanceYear = localStorage.getItem('FinanceYear') ?? undefined;
    this.BranchID = localStorage.getItem('BranchId') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.IMPGENRAL = 'IMPGENERAL';
    this.setupAutocompleteListeners();
  }
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

  saveForm(data: any) {}
  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: ['vessel_Gen_VesselName'],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
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

  fetchCountryNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetCountry',
      'GetCountry',
      'CountryName',
      payloadType
    );
  }

  fetchStateNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_StateName',
      'GetStateName',
      'StateName',
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

  //Search Details

  onSearch() {
    this.isFormVisible = false;
    this.isGridVisible = true;
    this.fetchGridData(this.tabName);
  }
  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'select') {
      this.ModifyVesselId = event.data.VesselID;
      this.fillGeneralForm(event.data);
    }
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['select', 'VesselName', 'VesselCode', 'ImoCode'],
    };

    const payload = {
      AgentID: this.AgentID,
    };

    this.agentService.Nvocc_VesselMaster(tab, payload).subscribe(
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

  // Populate fields

  fillGeneralForm(row: any) {
    this.isModifyVisible = true;
    this.isFormVisible = true;
    this.isGridVisible = false;
    this.ModifyVesselId = row.VesselID || null;

    const formValues: any = {};
    this.generalFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractGeneralRowKey(fieldId);
      let value = row[key] ?? '';
      if (field.type === 'checkbox') {
        value = row[key] === 'Y' ? true : false;
      }
      formValues[fieldId] = value;
    });
    this.generalForm.patchValue(formValues);
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^vessel_Gen_/, '');
  }

  convertToDateInputFormat(dateStr: string): string {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  //  Save all Forms

  OnMasterSave(action: any): void {
    if (!this.validateMandatoryFields(this.generalForm, 'GENERAL')) return;
    const data = {
      Strmode: action,
      Nvocc_AgentID: this.AgentID,
      VesselID: action === 'Update' ? this.ModifyVesselId : '',
    };

    const combinedPayload = {
      ...this.generalForm.getRawValue(),
      ...data,
    };

    this.agentService.NVOCC_Save_VesselMaster(combinedPayload).subscribe({
      next: (res) => {
        if (res.Status === 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${res.Message}`,
          });

          this.ModifyVesselId = res.ReturnVesselID;
          this.isModifyVisible = true;
          this.ClearForms();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: res.Message,
          });
        }
      },
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  //Clear Forms

  ClearForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.generalForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.ModifyVesselId = '';
    this.isModifyVisible = false;
    this.isFormVisible = true;
    this.isGridVisible = false;
  }
}
