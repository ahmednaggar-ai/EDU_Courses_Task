import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TableService } from '../table/table.service';
import {
  FilterChangeHandler,
  FilterConfig,
  FilterFieldConfig,
  FilterValues,
} from './filters.interface';

@Injectable()
export class FilterService {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tableService = inject(TableService, { optional: true });

  private readonly fieldsSignal = signal<FilterFieldConfig[]>([]);
  private readonly showClearButtonSignal = signal(true);
  private readonly valuesSignal = signal<FilterValues>({});
  private defaultValues: FilterValues = {};
  private filterHandler: FilterChangeHandler | null = null;
  private formGroup: FormGroup = this.fb.group({});

  readonly fields = this.fieldsSignal.asReadonly();
  readonly showClearButton = this.showClearButtonSignal.asReadonly();
  readonly values = this.valuesSignal.asReadonly();

  readonly hasActiveFilters = computed(() => {
    const current = this.valuesSignal();
    return Object.keys(this.defaultValues).some(
      (key) => !this.isEqual(current[key], this.defaultValues[key]),
    );
  });

  get form(): FormGroup {
    return this.formGroup;
  }

  configure(config: FilterConfig): void {
    this.fieldsSignal.set(config.fields);
    this.showClearButtonSignal.set(config.showClearButton ?? true);

    const controls: Record<string, FormControl> = {};
    this.defaultValues = {};

    for (const field of config.fields) {
      const defaultValue = this.getDefaultValue(field);
      this.defaultValues[field.key] = defaultValue;
      controls[field.key] = this.fb.control(defaultValue);
    }

    this.formGroup = this.fb.group(controls);
    const initialValues = this.formGroup.getRawValue() as FilterValues;
    this.valuesSignal.set(initialValues);
    this.bindValueChanges(config.debounceMs ?? 200);
    this.emitFilterChange(initialValues);
  }

  setFilterHandler(handler: FilterChangeHandler | null): void {
    this.filterHandler = handler;
  }

  clearFilters(): void {
    this.formGroup.reset(this.defaultValues);
  }

  private bindValueChanges(debounceMs: number): void {
    this.formGroup.valueChanges
      .pipe(debounceTime(debounceMs), takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const filterValues = values as FilterValues;
        this.valuesSignal.set(filterValues);
        this.tableService?.resetPagination();
        this.emitFilterChange(filterValues);
      });
  }

  private emitFilterChange(values: FilterValues): void {
    this.filterHandler?.(values);
  }

  private getDefaultValue(field: FilterFieldConfig): unknown {
    switch (field.type) {
      case 'text':
        return '';
      case 'select':
      case 'datepicker':
        return null;
      default:
        return null;
    }
  }

  private isEqual(a: unknown, b: unknown): boolean {
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    return a === b;
  }
}
