import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-azure-ad',
  imports: [RouterLink, Button, ThemeToggleComponent],
  templateUrl: './azure-ad.component.html',
  styleUrl: './azure-ad.component.scss',
})
export class AzureAdComponent {}
