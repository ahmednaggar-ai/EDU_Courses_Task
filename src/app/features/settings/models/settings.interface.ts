export type SettingsTab = 'general' | 'security' | 'notifications' | 'system';

export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: string;
}

export interface SettingsProfile {
  fullName: string;
  email: string;
  department: string;
  role: string;
}

export interface SettingsSecurity {
  currentPassword: string;
  newPassword: string;
}

export interface SettingsNotifications {
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface SettingsSystemPreferences {
  language: string;
  timezone: string;
}
