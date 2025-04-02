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
  @Input() isInputGroupField!: (fieldId: string) => boolean;
  @Input() isMandatoryField!: (fieldId: string) => boolean;
  @Input() getAutocompleteOptions!: (fieldId: string) => string[];
  @Output() formSubmit = new EventEmitter();

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
}
