import {
  Component,
  ViewChild,
  Output,
  OnInit,
  TemplateRef,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { AgentService } from '../../../services/agent.service';
import { DynamicFormsComponent } from '../../layout/dynamic-forms/dynamic-forms.component';
import { DynamicGridviewComponent } from '../../layout/dynamic-gridview/dynamic-gridview.component';
import { DynamicGridAddDeleteComponent } from '../../layout/dynamic-grid-add-delete/dynamic-grid-add-delete.component';
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
import { GENERAL_FIELDS } from './pre-alert-mail-input-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoaderComponent } from '../../layout/loader/loader.component';
@Component({
  selector: 'app-pre-alert-mail',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastModule,
    FormsModule,
    LoaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './pre-alert-mail.component.html',
  styleUrl: './pre-alert-mail.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PreAlertMailComponent implements OnInit {
  CompanyId: string | undefined;
  JobId: any | undefined;
  AgentID: any | undefined;
  tabName: string = 'GENERAL';
  tabLabels: string[] = ['GENERAL'];
  tabContents: TemplateRef<any>[] = [];
  generalForm!: FormGroup;
  gridData: any[] = [];
  gridContainerData: any[] = [];
  displayedColumns: string[] = [];
  isMailVisible: boolean = false;
  isGridVisible: boolean = false;
  fullGridData: string[] = [];
  selectedColumns: string[] = [];
  generalFields = GENERAL_FIELDS;
  PREALERT: string = 'PREALERT';
  selectedJobIds: string[] = [];

  //Mail
  mailFields = [
    { label: 'Job Booking Confirmation', value: 'Job Booking Confirmation' },
    { label: 'Container Dispatch Report', value: 'Container Dispatch Report' },
    { label: 'Stuffing Confirmation', value: 'Stuffing Confirmation' },
    { label: 'Gate In Confirmation', value: 'Gate In Confirmation' },
    { label: 'On–Board Confirmation', value: 'On–Board Confirmation' },
    {
      label: 'Transshipment Vessel Details',
      value: 'Transshipment Vessel Details',
    },
  ];
  selectedMailOption: string = 'Job Booking Confirmation';
  mailSubject: string = '';
  toMail: string = '';
  ccMail: string = '';
  mailBody: SafeHtml = '';
  sendMailBody: string = '';
  isLoading = false;

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @ViewChild('gridExpCont') gridExpCont!: DynamicGridAddDeleteComponent;

  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.generalForm = this.createForm(this.generalFields);
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.PREALERT = 'PREALERT';
    this.setupAutocompleteListeners();
    this.PatchGridData();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.GENERAL) {
        this.tabContents = [this.GENERAL];
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
      GENERAL: ['gen_HblNo'],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
  }

  PatchGridData(): void {
    this.generalForm
      .get('gen_HblNo')
      ?.valueChanges.subscribe((GetMBLNo: string) => {
        if (GetMBLNo && GetMBLNo.trim() !== '') {
          this.fetchGridData('GENERAL');
        }
      });
    this.isGridVisible = true;
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
    this.fetchGridData('GENERAL');
  }

  fetchMBLNoSuggestions(
    input: string,
    payloadType: string
  ): Observable<string[]> {
    return this.fetchData(
      input,
      'NVOCC_GetMBLNoPreAlert',
      'GetMBLNo',
      'MBLNo',
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
        AgentID: this.AgentID,
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
  HandleRowAction(event: { action: string; data: any }) {
    if (event.action === 'checkbox') {
      const jobId = event.data.JobID || event.data.ID;
      const index = this.selectedJobIds.indexOf(jobId);

      if (index === -1) {
        this.selectedJobIds.push(jobId);
      } else {
        this.selectedJobIds.splice(index, 1);
      }
    }
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: [
        'checkbox',
        'JobNo',
        'JobDate',
        'MBLNo',
        'HBLNo',
        'POD',
        'NoOfContainer',
        'VesselName',
        'VoyageNo',
      ],
    };

    const payload = {
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
      MBLNO: this.generalForm?.get('gen_HblNo')?.value || '',
    };

    if (this.tabName !== 'MAIL') {
      this.agentService.fetchJobDetails(tab, payload).subscribe(
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
  }

  //Mail below
  onGenerateMail() {
    this.isGridVisible = false;
    this.isMailVisible = true;
    this.JobId = this.selectedJobIds.join(',');
    const payload = {
      JobID: this.JobId,
      CompanyID: this.CompanyId,
      MBLNo: this.generalForm?.get('gen_HblNo')?.value || '',
      AgentID: this.AgentID,
    };

    this.agentService.NVOCC_GeneratePreAlertMail(payload).subscribe(
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
          this.ClearForms();
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

  handleDynamicButton(event: { fieldId: string; action: string }) {
    if (event.action && typeof (this as any)[event.action] === 'function') {
      (this as any)[event.action]();
    }
  }

  ClearForms(): void {
    const formMap: { [key: string]: FormGroup | undefined } = {
      generalForm: this.generalForm,
    };

    Object.values(formMap).forEach((form) => {
      form?.reset();
      form?.markAsPristine();
      form?.markAsUntouched();
    });
    this.JobId = '';
    this.isGridVisible = false;
    this.isMailVisible = false;
  }
}
