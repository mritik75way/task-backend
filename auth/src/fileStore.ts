export interface StoredFile {
  id: string;
  originalName: string;
  storedName: string;
  folderId: string;
}

export const files: StoredFile[] = [];
