import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MockDataService } from '../../../../core/services/mock-data.service';
import {
  getControlErrorMessage,
  getFormControl,
  isControlInvalid,
} from '../../../../shared/utils/form-validation.util';
import { Course, CourseCategory, CourseStatus } from '../../models/course.interface';
import { CourseFormDialogData, CourseFormDialogResult } from './course-form-dialog.interface';

@Component({
  selector: 'app-course-form-dialog',
  imports: [ReactiveFormsModule, Button, InputText, InputNumber, Select],
  templateUrl: './course-form-dialog.component.html',
  styleUrl: './course-form-dialog.component.scss',
})
export class CourseFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig<CourseFormDialogData>);
  private readonly mockDataService = inject(MockDataService);

  protected readonly statusOptions = this.mockDataService.getCourseStatusFormOptions();
  protected readonly categoryOptions = this.mockDataService.getCourseCategoryFormOptions();
  protected readonly isEdit = !!this.dialogConfig.data?.course;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    instructor: ['', Validators.required],
    category: [null as CourseCategory | null, Validators.required],
    duration: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    status: [null as CourseStatus | null, Validators.required],
    icon: ['', Validators.required],
    iconColor: ['', Validators.required],
  });

  ngOnInit(): void {
    const course = this.dialogConfig.data?.course;

    if (course) {
      this.form.patchValue(course);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const existing = this.dialogConfig.data?.course;

    const course: Course = {
      id: existing?.id ?? this.generateCourseId(),
      name: value.name,
      instructor: value.instructor,
      category: value.category!,
      duration: value.duration,
      price: value.price!,
      status: value.status!,
      icon: value.icon,
      iconColor: value.iconColor,
    };

    const result: CourseFormDialogResult = { course };
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

  private generateCourseId(): string {
    return `CRS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  }
}
