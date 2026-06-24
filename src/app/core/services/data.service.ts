import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../features/courses/models/course.interface';
import { Instructor } from '../../features/instructors/models/instructor.interface';
import { User } from '../models/user.interface';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/assets/data/courses.json');
  }

  getInstructors(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>('/assets/data/instructors.json');
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/assets/data/users.json');
  }
}
