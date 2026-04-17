import { API_BASE } from "../sections/common";

export async function getTiposMantenimiento(filtros?: any) {

  const params = new URLSearchParams();

  if (filtros?.nombre) params.append("nombre", filtros.nombre);

  const url = `${API_BASE}/tipos-mantenimiento/${params.toString() ? `?${params}` : ""}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Error cargando tipos de mantenimiento");

  return res.json();
}