import { Injectable } from '@angular/core';
import { StoredAuthSession, User } from '../models/user.interface';
import { decryptValue, encryptValue } from '../utils/auth-crypto.util';

const SESSION_STORAGE_KEY = 'eduflow_auth_session';
const REGISTERED_USERS_KEY = 'eduflow_registered_users';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  saveSession(credentials: StoredAuthSession): void {
    const payload = JSON.stringify({
      email: encryptValue(credentials.email),
      password: encryptValue(credentials.password),
      rememberMe: credentials.rememberMe,
    });

    localStorage.setItem(SESSION_STORAGE_KEY, encryptValue(payload));
  }

  readSession(): StoredAuthSession | null {
    const encrypted = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!encrypted) {
      return null;
    }

    try {
      const decrypted = decryptValue(encrypted);
      const parsed = JSON.parse(decrypted) as {
        email: string;
        password: string;
        rememberMe: boolean;
      };

      const email = decryptValue(parsed.email);
      const password = decryptValue(parsed.password);

      if (!email || !password) {
        return null;
      }

      return {
        email,
        password,
        rememberMe: parsed.rememberMe,
      };
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  hasSession(): boolean {
    return !!localStorage.getItem(SESSION_STORAGE_KEY);
  }

  getRegisteredUsers(): User[] {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as User[];
    } catch {
      return [];
    }
  }

  saveRegisteredUsers(users: User[]): void {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }

  addRegisteredUser(user: User): void {
    const users = this.getRegisteredUsers();

    if (users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) {
      return;
    }

    this.saveRegisteredUsers([...users, user]);
  }
}
