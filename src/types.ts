export type ActiveScreen = 'login' | 'dashboard' | 'change_list' | 'change_form' | 'explorer' | 'playground';

export interface AdminUser {
  username: string;
  fullName: string;
  email: string;
  initials: string;
}

export interface DjangoModel {
  id: string;
  name: string;
  appLabel: string;
  recordsCount: number;
  iconName: string;
}

export interface DjangoApp {
  name: string;
  appLabel: string;
  models: DjangoModel[];
}

export interface SimulatedRecord {
  id: number;
  name: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Draft' | 'Inactive' | 'Cancelled' | 'Blocked';
  category: string;
  updatedAt: string;
  author: string;
  email?: string;
  role?: string;
  amount?: string;
}

export interface CodeFile {
  path: string;
  label: string;
  language: 'python' | 'html' | 'css' | 'javascript';
  content: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}
