export interface ReasonNote {
  reason_note: string;
}

export interface UploadFile {
  uri: string;
  name: string;
  type: string;
}

export interface ServiDataForm {
  organization_id: number;
  product_id: number;
  user_id: number;
  status_id: number;
  date_entry: string;
  file: UploadFile[] | null;
  reason_notes: ReasonNote[];
}