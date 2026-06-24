import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MockDataService } from '../../../../core/services/mock-data.service';
import {
  getControlErrorMessage,
  getFormControl,
  isControlInvalid,
} from '../../../../shared/utils/form-validation.util';
import { Instructor, InstructorStatus } from '../../models/instructor.interface';
import {
  InstructorFormDialogData,
  InstructorFormDialogResult,
} from './instructor-form-dialog.interface';

@Component({
  selector: 'app-instructor-form-dialog',
  imports: [ReactiveFormsModule, Button, InputText, Select],
  templateUrl: './instructor-form-dialog.component.html',
  styleUrl: './instructor-form-dialog.component.scss',
})
export class InstructorFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig<InstructorFormDialogData>);
  private readonly mockDataService = inject(MockDataService);

  protected readonly statusOptions = this.mockDataService.getInstructorStatusFormOptions();
  protected readonly departmentOptions = this.mockDataService.getInstructorDepartmentOptions();
  protected readonly isEdit = !!this.dialogConfig.data?.instructor;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    department: [null as string | null, Validators.required],
    status: [null as InstructorStatus | null, Validators.required],
  });

  ngOnInit(): void {
    const instructor = this.dialogConfig.data?.instructor;

    if (instructor) {
      this.form.patchValue(instructor);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const existing = this.dialogConfig.data?.instructor;

    const instructor: Instructor = {
      id: existing?.id ?? this.generateInstructorId(),
      name: value.name,
      email: value.email,
      department: value.department!,
      status: value.status!,
    };

    const result: InstructorFormDialogResult = { instructor };
    this.dialogRef.close(result);
  }

  protected fieldError(fieldName: string): string | null {
    return getControlErrorMessage(getFormControl(this.form, fieldName));
  }

  protected isInvalid(fieldName: string): boolean {
    return isControlInvalid(getFormControl(this.form, fieldName));
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  private generateInstructorId(): string {
    return `INS-${String(Date.now()).slice(-6)}`;
  }
}
