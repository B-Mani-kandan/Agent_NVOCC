import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
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
export class DynamicFormsComponent {
  @Input() formGroup!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() templateId!: string;
  @Input() isMandatoryField!: (fieldId: string) => boolean;
  @Input() getAutocompleteOptions!: (fieldId: string) => string[];
  @Output() formSubmit = new EventEmitter();
  @Output() optionSelected = new EventEmitter<{
    fieldId: string;
    value: string;
  }>();
  @ViewChild(MatAutocompleteTrigger, { static: false })
  autocomplete!: MatAutocompleteTrigger;

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
      !/^[a-zA-Z0-9 ,.@]$/.test(char)
    ) {
      event.preventDefault();
      return;
    }

    // No validators - allow letters, numbers, and spaces
    if (!field.validators && !/^[a-zA-Z0-9 ]$/.test(char)) {
      event.preventDefault();
    }
  }
}
