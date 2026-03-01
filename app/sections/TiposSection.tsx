"use client";

import { useEffect, useState } from "react";
import { API_BASE, TipoVehiculo } from "./common";

export function TiposSection() {
  const [tipos, setTipos] = useState<TipoVehiculo[]>([]);

  const fetchTipos = async () => {
    const response = await fetch(`${API_BASE}/tipos_vehiculos`);
    const data = await response.json();
    setTipos(data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTipos().catch(() => {});
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tipos de vehículo</h2>
          <p className="mt-1 text-sm text-white/60">Catálogo para consultar descripciones (sin modificar BD).</p>
        </div>

        <button
          onClick={fetchTipos}
          className="rounded-xl bg-black/25 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
        >
          Refrescar
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full border-collapse bg-black/20 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {tipos.length === 0 ? (
              <tr className="border-t border-white/10">
                <td colSpan={2} className="px-4 py-6 text-center text-sm text-white/60">
                  Sin datos.
                </td>
              </tr>
            ) : (
              tipos.map((tipo) => (
                <tr key={tipo.id_tipo} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/80">{tipo.id_tipo}</td>
                  <td className="px-4 py-3 text-white/80">{tipo.descripcion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
