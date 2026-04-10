import { API_BASE } from "../sections/common";
export async function getHistorialMantenimientos(
  numSerie: string,
  filtros: any,
  offset: number = 0,
  limit: number = 5
) {
  const params = new URLSearchParams();

  if (filtros.folio)
    params.append("folio", filtros.folio);

  if (filtros.id_tipo_mantenimiento)
    params.append("id_tipo_mantenimiento", filtros.id_tipo_mantenimiento);

  if (filtros.estado)
    params.append("estado", filtros.estado);

  if (filtros.fecha_ingreso)
    params.append("fecha_ingreso", filtros.fecha_ingreso);

  if (filtros.fecha_egreso)
    params.append("fecha_egreso", filtros.fecha_egreso);

  if (filtros.fecha_inicio)
    params.append("fecha_inicio", filtros.fecha_inicio);

  if (filtros.fecha_termino)
    params.append("fecha_termino", filtros.fecha_termino);

  params.append("orden", filtros.orden || "desc");
  params.append("offset", String(offset));
  params.append("limit", String(limit));

  const url = `${API_BASE}/vehiculos/${numSerie}/mantenimientos?${params.toString()}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Error cargando historial");

  return res.json();
}
export async function crearMantenimiento(data: {
  num_serie: string;
  id_tipo_mantenimiento: number;
  fecha_inicio_mantenimiento: string;
}) {

  const res = await fetch(`${API_BASE}/mantenimientos/insertar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || "Error al crear mantenimiento");
  }

  return json;
}