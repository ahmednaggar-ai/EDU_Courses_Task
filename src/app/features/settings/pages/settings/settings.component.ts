import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SettingsTab, SettingsTabItem } from '../../models/settings.interface';
import {
  SettingsDepartmentOption,
  SettingsLanguageOption,
  SettingsTimezoneOption,
} from './settings.interface';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, Button, InputText, Select],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  protected readonly tabs: SettingsTabItem[] = [
    { id: 'general', label: 'General Profile', icon: 'pi pi-user' },
    { id: 'security', label: 'Account Security', icon: 'pi pi-shield' },
    { id: 'notifications', label: 'Notifications', icon: 'pi pi-bell' },
    { id: 'system', label: 'System Preferences', icon: 'pi pi-cog' },
  ];

  protected readonly activeTab = signal<SettingsTab>('general');

  protected fullName = 'Dr. Julian Reed';
  protected email = 'j.reed@eduflow.edu';
  protected department = 'academic-affairs';
  protected role = 'System Administrator';

  protected currentPassword = '';
  protected newPassword = '';
  protected emailNotifications = true;
  protected pushNotifications = false;
  protected language = 'en';
  protected timezone = 'utc-5';

  protected readonly departments: SettingsDepartmentOption[] = [
    { label: 'Academic Affairs', value: 'academic-affairs' },
    { label: 'Student Services', value: 'student-services' },
    { label: 'IT Administration', value: 'it-administration' },
    { label: 'Faculty Relations', value: 'faculty-relations' },
  ];

  protected readonly languages: SettingsLanguageOption[] = [
    { label: 'English (US)', value: 'en' },
    { label: 'French', value: 'fr' },
    { label: 'Spanish', value: 'es' },
  ];

  protected readonly timezones: SettingsTimezoneOption[] = [
    { label: 'Eastern Time (UTC-5)', value: 'utc-5' },
    { label: 'Central Time (UTC-6)', value: 'utc-6' },
    { label: 'Pacific Time (UTC-8)', value: 'utc-8' },
  ];

  protected selectTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  protected cancel(): void {
    this.fullName = 'Dr. Julian Reed';
    this.email = 'j.reed@eduflow.edu';
    this.department = 'academic-affairs';
  }

  protected save(): void {
    // Static page — no persistence
  }
}
