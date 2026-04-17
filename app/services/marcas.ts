import { API_BASE } from "../sections/common";

export async function getMarcas() {
  const res = await fetch(`${API_BASE}/marcas`);

  if (!res.ok) {
    throw new Error("Error al obtener marcas");
  }

  return await res.json();
}