import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-autocomplete',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
})
export class AutocompleteComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() options: string[] = [];
  @Input() label!: string;
  @Input() id!: string;

  filteredOptions!: Observable<string[]>;
  form!: FormGroup;
  myControl!: FormControl;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.form = this.fb.group({
      controlName: new FormControl(''),
    });

    this.myControl = this.form.get('controlName') as FormControl;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
