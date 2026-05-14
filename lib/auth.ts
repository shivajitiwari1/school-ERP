import { readDB } from './db';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar: string;
  createdAt: string;
}

export function authenticateUser(email: string, password: string): Omit<User, 'password'> | null {
  const users = readDB<User>('users');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function getUserById(id: string): Omit<User, 'password'> | null {
  const users = readDB<User>('users');
  const user = users.find(u => u.id === id);
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}
