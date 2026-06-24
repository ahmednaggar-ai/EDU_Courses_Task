import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FilterService } from './filter.service';
import { FilterFieldConfig } from './filters.interface';

@Component({
  selector: 'app-filters',
  imports: [ReactiveFormsModule, InputText, Select, DatePicker, Button],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  protected readonly filterService = inject(FilterService);

  protected fieldType(field: FilterFieldConfig): string {
    return field.type;
  }
}
