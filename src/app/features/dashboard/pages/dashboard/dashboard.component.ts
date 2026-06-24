import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { CourseCategory } from '../../../courses/models/course.interface';
import { CoursesActions } from '../../../courses/store/courses.actions';
import { InstructorsActions } from '../../../instructors/store/instructors.actions';
import {
  selectDashboardLoading,
  selectDashboardViewModel,
} from '../../store/dashboard.selectors';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, Button, Tag, Skeleton, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly store = inject(Store);
  private readonly mockDataService = inject(MockDataService);

  private readonly categorySeverityMap = this.mockDataService.getCategorySeverityMap();

  protected readonly loading = toSignal(this.store.select(selectDashboardLoading), {
    initialValue: true,
  });

  protected readonly viewModel = toSignal(this.store.select(selectDashboardViewModel), {
    initialValue: null,
  });

  constructor() {
    this.store.dispatch(CoursesActions.load());
    this.store.dispatch(InstructorsActions.load());
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

  protected statusSeverity(status: string): string {
    if (status === 'Active') {
      return 'success';
    }

    if (status === 'Draft') {
      return 'warn';
    }

    return 'secondary';
  }
}
