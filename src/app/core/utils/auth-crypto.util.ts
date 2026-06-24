const AUTH_SECRET = 'eduflow-auth-secret-v1';

export function encryptValue(value: string): string {
  const encoded = value
    .split('')
    .map((char, index) =>
      String.fromCharCode(char.charCodeAt(0) ^ AUTH_SECRET.charCodeAt(index % AUTH_SECRET.length)),
    )
    .join('');

  return btoa(encoded);
}

export function decryptValue(encrypted: string): string {
  try {
    const decoded = atob(encrypted);

    return decoded
      .split('')
      .map((char, index) =>
        String.fromCharCode(char.charCodeAt(0) ^ AUTH_SECRET.charCodeAt(index % AUTH_SECRET.length)),
      )
      .join('');
  } catch {
    return '';
  }
}
