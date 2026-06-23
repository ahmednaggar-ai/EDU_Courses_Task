import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-support-desk',
  imports: [RouterLink, Button, ThemeToggleComponent],
  templateUrl: './support-desk.component.html',
  styleUrl: './support-desk.component.scss',
})
export class SupportDeskComponent {}
