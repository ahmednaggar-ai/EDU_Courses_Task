import { SelectOption } from '../../../../shared/interfaces/select-option.interface';

export type SignUpRoleValue = 'dean' | 'head' | 'registrar' | 'it-admin';

export type SignUpRoleOption = SelectOption<SignUpRoleValue>;

export interface SignUpForm {
  fullName: string;
  email: string;
  password: string;
  role: SignUpRoleValue | null;
  agreedToTerms: boolean;
}
