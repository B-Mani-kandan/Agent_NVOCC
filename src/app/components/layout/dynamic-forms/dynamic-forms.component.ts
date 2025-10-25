import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
@Component({
  selector: 'app-dynamic-forms',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dynamic-forms.component.html',
  styleUrl: './dynamic-forms.component.css',
})
export class DynamicFormsComponent implements AfterViewInit, OnChanges {
  @Input() formGroup!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() templateId!: string;
  @Input() isMandatoryField!: (fieldId: string) => boolean;
  @Input() getAutocompleteOptions!: (fieldId: string) => string[];
  @Input() initialUploadedFiles?: { [key: string]: string };
  @Output() formSubmit = new EventEmitter();
  @Output() buttonClick = new EventEmitter<{
    fieldId: string;
    action: string;
  }>();
  @Output() optionSelected = new EventEmitter<{
    fieldId: string;
    value: string;
  }>();
  isInitialized: boolean = false;
  uploadedFiles: { [key: string]: string } = {};
  passwordVisible: { [key: string]: boolean } = {};
  @ViewChild(MatAutocompleteTrigger, { static: false })
  autocomplete!: MatAutocompleteTrigger;

  constructor(public cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.isInitialized = true;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialUploadedFiles'] && this.initialUploadedFiles) {
      this.uploadedFiles = {
        ...this.uploadedFiles,
        ...this.initialUploadedFiles,
      };
      try {
        this.cdr.detectChanges();
      } catch (e) {}
    }
  }

  onSubmit() {
    this.formSubmit.emit(this.formGroup.value);
  }

  highlightFirstOption() {
    setTimeout(() => {
      if (this.autocomplete && this.autocomplete.panelOpen) {
        const firstOption = document.querySelector('.mat-mdc-option');
        if (firstOption) {
          (firstOption as HTMLElement).classList.add('mat-mdc-option-active');
        }
      }
    }, 50);
  }

  //Autocomplete select triggering
  onOptionSelected(event: MatAutocompleteSelectedEvent, field: any) {
    const value = event.option.value;
    this.formGroup.get(field.id)?.setValue(value, { emitEvent: false });
    this.optionSelected.emit({ fieldId: field.id, value });
  }

  onKeyPress(event: KeyboardEvent, field: any) {
    const char = event.key;
    const isLetter = /^[a-zA-Z]$/.test(char);
    const isDigit = /^[0-9]$/.test(char);

    // Letters only
    if (
      field.validators?.includes('lettersOnly') &&
      !isLetter &&
      char !== ' '
    ) {
      event.preventDefault();
      return;
    }

    // Numbers only
    if (field.validators?.includes('numbersOnly') && !isDigit) {
      event.preventDefault();
      return;
    }

    if (
      field.validators?.includes('lettersNumbersCommaDot') &&
      !/^[a-zA-Z0-9 ,.@$#&*-]$/.test(char)
    ) {
      event.preventDefault();
      return;
    }

    // No validators - allow letters, numbers, and spaces
    if (!field.validators && !/^[a-zA-Z0-9 ]$/.test(char)) {
      event.preventDefault();
    }
  }

  onFileSelected(event: Event, field: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        input.value = '';
        return;
      }

      const control = this.formGroup.get(field.id);
      if (!control) return;
      control.setValue(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          this.uploadedFiles = {
            ...this.uploadedFiles,
            [field.id]: reader.result as string,
          };
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility(fieldId: string): void {
    this.passwordVisible[fieldId] = !this.passwordVisible[fieldId];
  }

  removeFile(field: any) {
    delete this.uploadedFiles[field.id];
    if (this.formGroup.get(field.id)) {
      this.formGroup.get(field.id)?.reset();
    }
  }

  onButtonClick(field: any) {
    if (field.function) {
      this.buttonClick.emit({ fieldId: field.id, action: field.function });
    }
  }

  onKeyDown(event: KeyboardEvent, field: any) {
    if (event.key === 'Tab') {
      const panelOpen = document.querySelector(
        '.mat-mdc-autocomplete-panel, .mat-autocomplete-panel, .mat-mdc-autocomplete-panel-visible, .mat-autocomplete-panel-visible'
      );
      if (panelOpen) {
        event.preventDefault();
        event.stopPropagation();

        const activeOptEl = panelOpen.querySelector<HTMLElement>(
          '.mat-mdc-option-active, .mat-option-active, .mat-mdc-option.mat-mdc-option-active, .mat-option.mat-active, .mat-mdc-option.mat-selected, .mat-option.mat-selected'
        );

        let value: string | null = null;

        if (activeOptEl) {
          value = (activeOptEl.textContent || '').trim();
        }
        if (!value) {
          const firstOptEl = panelOpen.querySelector<HTMLElement>(
            '.mat-mdc-option, .mat-option'
          );
          if (firstOptEl) value = (firstOptEl.textContent || '').trim();
        }
        if (!value) {
          const options = this.getAutocompleteOptions(field.id) || [];
          if (options.length) value = options[0];
        }
        if (value) {
          this.formGroup.get(field.id)?.setValue(value, { emitEvent: false });
          this.optionSelected.emit({ fieldId: field.id, value });
        }
        try {
          if (this.autocomplete && this.autocomplete.panelOpen)
            this.autocomplete.closePanel();
        } catch (e) {
          (event.target as HTMLElement)?.blur?.();
        }
        setTimeout(() => this.focusNextElement(event.target as HTMLElement), 0);
      }
    }
  }

  private focusNextElement(currentEl: HTMLElement | null) {
    if (!currentEl) return;
    const focusable = Array.from(
      document.querySelectorAll<HTMLElement>(
        'input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null); // visible only

    const idx = focusable.indexOf(currentEl);
    const next =
      focusable[idx + 1] ?? focusable.find((el, i) => i > idx) ?? null;
    if (next) next.focus();
  }
}
