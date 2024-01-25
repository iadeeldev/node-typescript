import { promises as fsPromises } from 'fs';

export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error: any) {
    throw new Error(`Error reading or parsing JSON file at ${filePath}: ${error.message}`);
  }
}
