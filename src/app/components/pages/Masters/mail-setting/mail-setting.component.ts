import {
  Component,
  ViewChild,
  Output,
  OnInit,
  TemplateRef,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { AgentService } from '../../../../services/agent.service';
import { DynamicFormsComponent } from '../../../layout/dynamic-forms/dynamic-forms.component';
import { DynamicGridviewComponent } from '../../../layout/dynamic-gridview/dynamic-gridview.component';
import { HttpClient } from '@angular/common/http';
import { GENERAL_FIELDS } from './mail-setting-input-fields.config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-mail-setting',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormsComponent,
    DynamicGridviewComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './mail-setting.component.html',
  styleUrl: './mail-setting.component.css',
})
export class MailSettingComponent implements OnInit {
  CompanyId: string | undefined;
  FinanceYear: any | undefined;
  BranchID: any | undefined;
  CompID: any | undefined;
  AgentID: any | undefined;
  AgentName: any | undefined;
  BASE_URL: any | undefined;
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
  previewFiles: { [key: string]: string } = {};

  @ViewChild('GENERAL', { static: false }) GENERAL!: TemplateRef<any>;
  @Output() gridDataChange = new EventEmitter<any[]>();
  @ViewChild(DynamicFormsComponent)
  dynamicFormComponentRef!: DynamicFormsComponent;
  constructor(
    private agentService: AgentService,
    private http: HttpClient,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.tabName = 'GENERAL';
    this.generalForm = this.createForm(this.generalFields);
    this.CompanyId = localStorage.getItem('CompanyID') ?? undefined;
    this.CompID = localStorage.getItem('CompId') ?? undefined;
    this.FinanceYear = localStorage.getItem('FinanceYear') ?? undefined;
    this.BranchID = localStorage.getItem('BranchId') ?? undefined;
    this.AgentID = localStorage.getItem('AgentID') ?? undefined;
    this.AgentName = localStorage.getItem('AgentName') ?? undefined;
    this.generalForm.patchValue({
      mail_Gen_AgentName: this.AgentName,
    });
    this.IMPGENRAL = 'IMPGENERAL';
    let apiUrl = localStorage.getItem('ClientViewApiUrl') || '';
    if (!apiUrl.startsWith('http')) {
      apiUrl = 'https://' + apiUrl;
    }
    this.BASE_URL = apiUrl;
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
      GENERAL: [
        'mail_Gen_EmailID',
        'mail_Gen_Password',
        'mail_Gen_HostName',
        'mail_Gen_PortNo',
      ],
    };
    return (fieldId: string) =>
      mandatoryFields[templateId]?.includes(fieldId) || false;
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
      this.fillGeneralForm(event.data);
    }
  }

  fetchGridData(tab: string) {
    const columnMap: any = {
      GENERAL: ['select', 'AgentName', 'EmailID', 'HostName'],
    };

    const payload = {
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    this.agentService.Nvocc_MailSetting(tab, payload).subscribe(
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

    const LOGO_BASE_URL = `${this.BASE_URL}/data/`;
    const formValues: any = {};

    this.generalFields.forEach((field) => {
      const fieldId = field.id;
      const key = this.extractGeneralRowKey(fieldId);
      let value = row[key] ?? '';

      if (field.type === 'checkbox') {
        value = row[key] === 'Y';
      }

      if (fieldId === 'mail_Gen_Logo' && row['Logo']) {
        value = `${LOGO_BASE_URL}${row['Logo']}`;
      }
      formValues[fieldId] = value;
    });
    this.generalForm.patchValue(formValues);
    const logoUrl = formValues['mail_Gen_Logo'];
    this.previewFiles = logoUrl ? { mail_Gen_Logo: logoUrl } : {};
  }

  extractGeneralRowKey(fieldId: string): string {
    return fieldId.replace(/^mail_Gen_/, '');
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

  async OnMasterSave(): Promise<void> {
    if (!this.validateMandatoryFields(this.generalForm, 'GENERAL')) return;
    const formValues = { ...this.generalForm.getRawValue() };
    // Convert upload field to Base64 if a file is selected
    const uploadFieldId = 'mail_Gen_Logo';
    const file = this.generalForm.get(uploadFieldId)?.value;
    if (file instanceof File) {
      formValues[uploadFieldId] = await this.convertFileToBase64(file);
    }

    const combinedPayload = {
      ...formValues,
      CompanyID: this.CompanyId,
      AgentID: this.AgentID,
    };

    // Send payload
    this.agentService.NVOCC_Save_MailSettingMaster(combinedPayload).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${res.Message}`,
        });
        this.isModifyVisible = true;
        this.ClearForms();
      },
    });
  }

  // Utility to convert File to Base64
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
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

    this.previewFiles = {};
    this.isModifyVisible = false;
    this.isFormVisible = true;
    this.isGridVisible = false;
    this.generalForm.patchValue({
      mail_Gen_AgentName: this.AgentName,
    });
    window.location.reload();
  }
}
