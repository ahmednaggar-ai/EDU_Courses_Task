import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { ColorPicker } from 'primeng/colorpicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { map, take } from 'rxjs/operators';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { SelectOption } from '../../../../shared/interfaces/select-option.interface';
import {
  getControlErrorMessage,
  getFormControl,
  isControlInvalid,
} from '../../../../shared/utils/form-validation.util';
import { selectAllInstructors } from '../../../instructors/store/instructors.selectors';
import { InstructorsActions } from '../../../instructors/store/instructors.actions';
import { Course, CourseCategory, CourseStatus } from '../../models/course.interface';
import { CourseFormDialogData, CourseFormDialogResult } from './course-form-dialog.interface';

@Component({
  selector: 'app-course-form-dialog',
  imports: [ReactiveFormsModule, Button, InputText, Select, ColorPicker],
  templateUrl: './course-form-dialog.component.html',
  styleUrl: './course-form-dialog.component.scss',
})
export class CourseFormDialogComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig<CourseFormDialogData>);
  private readonly mockDataService = inject(MockDataService);

  protected readonly statusOptions = this.mockDataService.getCourseStatusFormOptions();
  protected readonly categoryOptions = this.mockDataService.getCourseCategoryFormOptions();
  protected readonly durationOptions = this.mockDataService.getCourseDurationOptions();
  protected readonly iconOptions = this.mockDataService.getCourseIconOptions();
  protected readonly instructorOptions = toSignal(
    this.store.select(selectAllInstructors).pipe(
      map((instructors) =>
        instructors.map(
          (instructor): SelectOption<string> => ({
            label: instructor.name,
            value: instructor.name,
          }),
        ),
      ),
    ),
    { initialValue: [] as SelectOption<string>[] },
  );
  protected readonly isEdit = !!this.dialogConfig.data?.course;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    instructor: [null as string | null, Validators.required],
    category: [null as CourseCategory | null, Validators.required],
    duration: [null as string | null, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    status: [null as CourseStatus | null, Validators.required],
    icon: [null as string | null, Validators.required],
    iconColor: ['#2563eb', Validators.required],
  });

  ngOnInit(): void {
    const course = this.dialogConfig.data?.course;

    if (course) {
      this.form.patchValue(course);
    }

    this.store
      .select(selectAllInstructors)
      .pipe(
        map((instructors) => instructors.length),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((count) => {
        if (!count) {
          this.store.dispatch(InstructorsActions.load());
        }
      });

    this.form.controls.icon.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((icon) => this.applyIconColor(icon));
  }

  protected formatPrice(value: number | null | undefined): string {
    return `${value ?? 0} $`;
  }

  protected onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/[^\d]/g, '');
    const numeric = digits ? Number(digits) : 0;

    this.form.controls.price.setValue(numeric);
    this.form.controls.price.markAsTouched();
    this.form.controls.price.updateValueAndValidity();
    input.value = this.formatPrice(numeric);
  }

  private applyIconColor(icon: string | null): void {
    if (!icon) {
      return;
    }

    const selectedIcon = this.iconOptions.find((option) => option.value === icon);

    if (selectedIcon?.previewColor && !this.isEdit) {
      this.form.controls.iconColor.setValue(selectedIcon.previewColor);
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
      instructor: value.instructor!,
      category: value.category!,
      duration: value.duration!,
      price: value.price,
      status: value.status!,
      icon: value.icon!,
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
