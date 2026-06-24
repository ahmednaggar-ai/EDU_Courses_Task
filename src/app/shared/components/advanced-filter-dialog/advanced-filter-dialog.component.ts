import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import {
  AdvancedFilterDialogData,
  AdvancedFilterDialogResult,
  AdvancedFilterFieldConfig,
  AdvancedFilterLogic,
  AdvancedFilterOperator,
  AdvancedFilterRule,
} from '../../interfaces/advanced-filter.interface';
import { SelectOption } from '../../interfaces/select-option.interface';

@Component({
  selector: 'app-advanced-filter-dialog',
  imports: [ReactiveFormsModule, Button, InputText, InputNumber, Select],
  templateUrl: './advanced-filter-dialog.component.html',
  styleUrl: './advanced-filter-dialog.component.scss',
})
export class AdvancedFilterDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig<AdvancedFilterDialogData>);

  protected readonly fields = this.dialogConfig.data?.fields ?? [];

  protected readonly logicOptions: SelectOption<AdvancedFilterLogic>[] = [
    { label: 'Match ALL rules (AND)', value: 'and' },
    { label: 'Match ANY rule (OR)', value: 'or' },
  ];

  protected readonly operatorOptions: SelectOption<AdvancedFilterOperator>[] = [
    { label: 'Contains', value: 'contains' },
    { label: 'Equals', value: 'equals' },
    { label: 'Starts with', value: 'startsWith' },
    { label: 'Greater than', value: 'greaterThan' },
    { label: 'Less than', value: 'lessThan' },
  ];

  protected readonly form = this.fb.group({
    logic: this.fb.nonNullable.control<AdvancedFilterLogic>('and'),
    rules: this.fb.array<FormGroup>([this.createRuleGroup()]),
  });

  ngOnInit(): void {
    const filters = this.dialogConfig.data?.filters;

    if (filters?.rules.length) {
      this.form.controls.logic.setValue(filters.logic);
      this.rules.clear();

      for (const rule of filters.rules) {
        this.rules.push(this.createRuleGroup(rule));
      }
    }
  }

  protected get rules(): FormArray<FormGroup> {
    return this.form.controls.rules;
  }

  protected fieldConfig(fieldKey: string): AdvancedFilterFieldConfig | undefined {
    return this.fields.find((field: AdvancedFilterFieldConfig) => field.key === fieldKey);
  }

  protected fieldOptions(): SelectOption<string>[] {
    return this.fields.map((field: AdvancedFilterFieldConfig) => ({
      label: field.label,
      value: field.key,
    }));
  }

  protected operatorsForField(fieldKey: string): SelectOption<AdvancedFilterOperator>[] {
    const field = this.fieldConfig(fieldKey);

    if (field?.type === 'number') {
      return this.operatorOptions.filter((option) =>
        ['equals', 'greaterThan', 'lessThan'].includes(option.value),
      );
    }

    if (field?.type === 'select') {
      return this.operatorOptions.filter((option) => option.value === 'equals');
    }

    return this.operatorOptions.filter((option) =>
      ['contains', 'equals', 'startsWith'].includes(option.value),
    );
  }

  protected addRule(): void {
    this.rules.push(this.createRuleGroup());
  }

  protected removeRule(index: number): void {
    if (this.rules.length === 1) {
      this.rules.at(0).reset({
        field: this.fields[0]?.key ?? '',
        operator: 'contains',
        value: null,
      });
      return;
    }

    this.rules.removeAt(index);
  }

  protected apply(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const result: AdvancedFilterDialogResult = {
      filters: {
        logic: value.logic,
        rules: value.rules.map((rule) => ({
          field: String(rule['field']),
          operator: rule['operator'] as AdvancedFilterOperator,
          value: rule['value'] as string | number | null,
        })),
      },
    };

    this.dialogRef.close(result);
  }

  protected clear(): void {
    const result: AdvancedFilterDialogResult = { filters: null };
    this.dialogRef.close(result);
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  private createRuleGroup(rule?: AdvancedFilterRule): FormGroup {
    const defaultField = rule?.field ?? this.fields[0]?.key ?? '';

    return this.fb.group({
      field: [defaultField, Validators.required],
      operator: [rule?.operator ?? this.defaultOperator(defaultField), Validators.required],
      value: [rule?.value ?? null],
    });
  }

  private defaultOperator(fieldKey: string): AdvancedFilterOperator {
    const field = this.fieldConfig(fieldKey);

    if (field?.type === 'number') {
      return 'equals';
    }

    if (field?.type === 'select') {
      return 'equals';
    }

    return 'contains';
  }
}
