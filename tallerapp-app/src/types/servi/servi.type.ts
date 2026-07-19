import {
  ConciergeBell,
  BriefcaseMedical,
  Boxes,
  Wrench,
  ClipboardCheck,
  Handshake,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

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