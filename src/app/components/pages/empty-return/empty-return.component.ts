import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AgentService } from '../../../services/agent.service';
import { HttpClient } from '@angular/common/http';
import {
  GENERAL_FIELDS,
  EMPTYRETURN_FIELDS,
} from './empty-return-input-fields.config';
import { EMPTY_AUTOCOMPLETE_FIELDS } from './autocomplete-fields.config';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-empty-return',
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastModule,
    DynamicFormsComponent,
  ],
  providers: [MessageService],
  templateUrl: './empty-return.component.html',
  styleUrl: './empty-return.component.css',
})
export class EmptyReturnComponent implements OnInit {
  CompanyId: string | undefined;
  CompID: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  AgentID: any | undefined;
  ModifyJobId: any | undefined;
  Country: any | undefined;
  ContainerID: any | undefined;
  ContainerNo: any | undefined;
  CTrackID: any | undefined;
  Size: any | undefined;
  CSize: any | undefined;
  gridData: any[] = [];
  displayedColumns: string[] = [];

  GeneralForm!: FormGroup;
  EmptyReturnForm!: FormGroup;
  GeneralFields = GENERAL_FIELDS;
  EmptyReturnFields = EMPTYRETURN_FIELDS;
  importfirstGridVisible: boolean = false;
  isGeneralFormVisible: boolean = true;
  isEmptyFormVisibile: boolean = false;
  EMPTY: string = 'EMPTY';

  ngOnInit() {
    this.GeneralForm = this.createForm(this.GeneralFields);
    this.EmptyReturnForm = this.createForm(this.EmptyReturnFields);
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.CompID = localStorage.getItem('CompId') ?? undefined;
    this.FinanceYear = localStorage.getItem('FinanceYear') ?? undefined;
    this.BranchID = localStorage.getItem('BranchId') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.setupAutocompleteListeners();
    this.EMPTY = 'EMPTY';
  }

  constructor(
    private agentService: AgentService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @ViewChild('EMPTYRETURN', { static: false }) EMPTYRETURN!: TemplateRef<any>;

  createForm(fields: any[]): FormGroup {
    let group: any = {};
    fields.forEach((field) => {
      group[field.id] = new FormControl('');
    });
    return new FormGroup(group);
  }

  getMandatoryFields(templateId: string): (fieldId: string) => boolean {
    const mandatoryFields: Record<string, string[]> = {
      GENERAL: [''],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }

  setupAutocompleteListeners() {
    EMPTY_AUTOCOMPLETE_FIELDS.forEach(
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

  fetchEmptyMBLNoSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetEmptyMBLNo',
      'GetMBLNo',
      'IGMMAWBNo',
      payloadType
    );
  }

  fetchEmptyHBLNoSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetEmptyHBLNo',
      'GetHBLNo',
      'IGMHAWBNo',
      payloadType
    );
  }

  fetchEmptyYardNameSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetEmptyYardName_EmptyReturn',
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
      common: {
        InputVal: input,
        CompanyId: this.CompanyId,
        BranchID: this.BranchID,
        FinanaceYear: this.FinanceYear,
      },
      EmptyYard: {
        InputVal: input,
        CompanyId: this.CompanyId,
        Country: this.Country,
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

  handleAutocomplete(e: { fieldId: string; value: string }) {
    this.fetchGridData('GENERAL');
    this.importfirstGridVisible = true;
  }

  HandleRowActionFirstGrid(event: { action: string; data: any }) {
    this.importfirstGridVisible = false;
    this.isGeneralFormVisible = false;
    this.isEmptyFormVisibile = true;
    this.Country = event.data.CountryCode;
    this.ContainerID = event.data.ContainerID;
    this.ContainerNo = event.data.ContainerNo;
    this.Size = event.data.C_Size;
    this.CSize = event.data.CSize;
    this.CTrackID = event.data.CTrackId;
  }

  fetchGridData(tab: string) {
    debugger;
    const columnMap: any = {
      GENERAL: ['select', 'ContainerNo', 'C_Size'],
    };

    const payload = {
      CompanyID: this.CompanyId,
      BranchID: this.BranchID,
      FinanceYear: this.FinanceYear,
      MblNo: this.GeneralForm?.get('empty_MblNo')?.value,
      HblNo: this.GeneralForm?.get('empty_HblNo')?.value,
    };

    this.agentService.Nvocc_EmptyReturnData(tab, payload).subscribe(
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
      }
    );
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

  //Save

  private buildPayload(form: FormGroup, extraData: any = {}): any {
    return {
      ...form.getRawValue(),
      ...extraData,
    };
  }
  //  Save all Forms

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
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
            detail: `${this.capitalize('EMTY RETURN')} ${res.Message}`,
          });
          onSuccess?.(res);
          this.fetchGridData('GENERAL');
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

  OnEmptyReturnSave(): void {
    if (!this.validateMandatoryFields(this.EmptyReturnForm, 'EMPTYRETURN'))
      return;
    const data = {
      ContainerID: this.ContainerID,
      ContainerNo: this.ContainerNo,
      Size: this.Size,
      CSize: this.CSize,
      CTrackID: this.CTrackID,
      MblNo: this.GeneralForm?.get('empty_MblNo')?.value,
      HblNo: this.GeneralForm?.get('empty_HblNo')?.value,
      CompanyID: this.CompanyId,
      FinanceYear: this.FinanceYear,
      BranchID: this.BranchID,
    };

    this.saveSection(
      this.EmptyReturnForm,
      this.agentService.NVOCC_Save_EmptyReturnDetails.bind(this.agentService),
      data
    );
    this.isGeneralFormVisible = true;
    this.isEmptyFormVisibile = false;
  }

  ClearEmptyReturn() {
    const formMap: { [key: string]: FormGroup | undefined } = {
      EmptyReturn: this.EmptyReturnForm,
    };
    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.Country = '';
    this.ContainerID = '';
    this.ContainerNo = '';
    this.Size = '';
    this.CSize = '';
    this.CTrackID = '';
    this.isGeneralFormVisible = true;
    this.isEmptyFormVisibile = false;
    this.importfirstGridVisible = true;
    this.fetchGridData('GENERAL');
  }
}
