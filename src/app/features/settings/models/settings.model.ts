export type SettingsTab = 'general' | 'security' | 'notifications' | 'system';

export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: string;
}
