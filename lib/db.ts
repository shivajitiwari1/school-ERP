import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function readDB<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

export function writeDB<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function findById<T extends { id: string }>(filename: string, id: string): T | null {
  const data = readDB<T>(filename);
  return data.find(item => item.id === id) || null;
}

export function insertRecord<T extends { id: string }>(filename: string, record: T): T {
  const data = readDB<T>(filename);
  data.push(record);
  writeDB(filename, data);
  return record;
}

export function updateRecord<T extends { id: string }>(filename: string, id: string, updates: Partial<T>): T | null {
  const data = readDB<T>(filename);
  const idx = data.findIndex(item => item.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  writeDB(filename, data);
  return data[idx];
}

export function deleteRecord<T extends { id: string }>(filename: string, id: string): boolean {
  const data = readDB<T>(filename);
  const filtered = data.filter(item => item.id !== id);
  if (filtered.length === data.length) return false;
  writeDB(filename, filtered);
  return true;
}

export function generateId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 4)}`;
}
