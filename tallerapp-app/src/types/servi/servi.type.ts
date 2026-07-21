import {
  ConciergeBell,
  BriefcaseMedical,
  Boxes,
  Wrench,
  ClipboardCheck,
  Handshake,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import {Client} from "@/types/user/user.type";
import {Product} from "@/types/product/product.type";

export const serviceConfig = {
  recepcionados: {
    icon: ConciergeBell,
  },
  diagnosticados: {
    icon: BriefcaseMedical,
  },
  repuestos: {
    icon: Boxes,
  },
  "en-reparacion": {
    icon: Wrench,
  },
  reparados: {
    icon: ClipboardCheck,
  },
  entregados: {
    icon: Handshake,
  },
} as const;

export type ServiceType = {
  label: string;
  count: number;
  slug:
      | "recepcionados"
      | "diagnosticados"
      | "repuestos"
      | "en-reparacion"
      | "reparados"
      | "entregados"
      | "incidencias";
  color: string;
};

type Option = {
  label: string;
  value: number;
};

export type FormDataService = {
  product: Option | null;
  client: Option | null;
  date_entry: Date;
  file: ImagePicker.ImagePickerAsset[];
  reason: string;
  reason_notes: { reason_note: string }[];
};


export interface Status {
  id: number;
  name: string; // Ej: "RECEPCIONADO"
}

export interface ServiceRecord {
  id: number;
  uuid: string;
  organization_id: number;
  product_id: number;
  user_id: number;
  status_id: number;
  approve_spare_parts: number; // o boolean si actua como flag (0/1)
  date_entry: string;
  created_at: string;
  updated_at: string;
  client: Client;
  product: Product;
  status: Status;

  // Arreglos vacíos tipados de forma genérica (ajustar si tienen datos)
  diagnosis: any[];
  file: any[];
  reasons: any[];
  spareparts: any[];

  // Campos nulos en el ejemplo
  date_exit?: string | null;
  final_note?: string | null;
  repair_price?: number | null;
  satisfied?: boolean | null;
}