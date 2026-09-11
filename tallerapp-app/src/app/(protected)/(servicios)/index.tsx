import { Redirect } from "expo-router";

/**
 * Entrada del modulo Servicios.
 *
 * El Drawer abre este index y lo redirigimos al primer estado del flujo.
 * Los cambios entre estados se hacen con las tabs superiores sin apilar
 * pantallas; crear un servicio si se apila en el Stack del modulo.
 */
export default function ServicesIndex() {
  return <Redirect href="/recepcionados" />;
}
