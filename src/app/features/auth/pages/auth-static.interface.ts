export interface AuthStaticPageMeta {
  title: string;
  subtitle: string;
  icon: string;
}

export interface AuthStaticPageAction {
  label: string;
  route: string;
  icon?: string;
  outlined?: boolean;
}
