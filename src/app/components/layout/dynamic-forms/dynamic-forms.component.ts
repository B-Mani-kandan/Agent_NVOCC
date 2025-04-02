import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-forms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms.component.html',
  styleUrl: './dynamic-forms.component.css',
})
export class DynamicFormsComponent {
  @Input() formGroup!: FormGroup;
  @Input() formFields: any[] = [];
  @Input() templateId!: string;
  @Input() isInputGroupField!: (fieldId: string) => boolean;
  @Input() isMandatoryField!: (fieldId: string) => boolean;
  @Output() formSubmit = new EventEmitter();

  onSubmit() {
    this.formSubmit.emit(this.formGroup.value);
  }
}
