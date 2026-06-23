import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sso-portal',
  imports: [RouterLink, Button, ThemeToggleComponent],
  templateUrl: './sso-portal.component.html',
  styleUrl: './sso-portal.component.scss',
})
export class SsoPortalComponent {}
