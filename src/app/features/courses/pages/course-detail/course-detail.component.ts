import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Course, CourseCategory } from '../../models/course.interface';
import { CoursesActions } from '../../store/courses.actions';
import { selectCourseById, selectCoursesLoading } from '../../store/courses.selectors';

@Component({
  selector: 'app-course-detail',
  imports: [Button, Tag, CurrencyPipe, DatePipe],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly mockDataService = inject(MockDataService);

  private readonly categorySeverityMap = this.mockDataService.getCategorySeverityMap();

  protected readonly loading = toSignal(this.store.select(selectCoursesLoading), {
    initialValue: true,
  });

  protected readonly course = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');

        if (!id) {
          return of(null as Course | null);
        }

        return this.store.select(selectCourseById(id));
      }),
    ),
    { initialValue: null as Course | null },
  );

  constructor() {
    this.store.dispatch(CoursesActions.load());
  }

  protected categoryLabel(category: CourseCategory): string {
    const labels: Record<CourseCategory, string> = {
      FRONTEND: 'Frontend',
      DESIGN: 'Design',
      BACKEND: 'Backend',
    };

    return labels[category];
  }

  protected categorySeverity(category: CourseCategory): string {
    return this.categorySeverityMap[category];
  }

  protected statusClass(status: string): string {
    return `course-detail__status-dot--${status.toLowerCase()}`;
  }

  protected goBack(): void {
    this.router.navigate(['/courses']);
  }
}
