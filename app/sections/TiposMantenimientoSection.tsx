"use client";

import { useEffect, useState } from "react";
import { API_BASE, Card, formatDateTime, MantenimientoRow, ResumenMantenimientos } from "./common";

export function TiposMantenimientoSection() {
  const [mantenimientos, setMantenimientos] = useState<MantenimientoRow[]>([]);
  const [resumen, setResumen] = useState<ResumenMantenimientos>({ en_mantenimiento_total: 0, por_tipo: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMantenimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resLista, resResumen] = await Promise.all([
        fetch(`${API_BASE}/mantenimientos`),
        fetch(`${API_BASE}/mantenimientos/resumen`),
      ]);

      if (!resLista.ok) throw new Error(`Error ${resLista.status} al cargar mantenimientos`);
      if (!resResumen.ok) throw new Error(`Error ${resResumen.status} al cargar resumen`);

      const [listaData, resumenData] = await Promise.all([resLista.json(), resResumen.json()]);

      setMantenimientos(Array.isArray(listaData) ? listaData : []);
      setResumen(
        resumenData && typeof resumenData === "object"
          ? resumenData
          : { en_mantenimiento_total: 0, por_tipo: [] },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar mantenimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMantenimientos().catch(() => {});
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card title="En mantenimiento">
          <p className="text-3xl font-bold">{loading ? "..." : resumen.en_mantenimiento_total}</p>
        </Card>
        {resumen.por_tipo.map((item) => (
          <Card key={item.tipo_mantenimiento} title={item.tipo_mantenimiento}>
            <p className="text-3xl font-bold">{loading ? "..." : item.total}</p>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Historial de mantenimientos</h2>
            <p className="mt-1 text-sm text-white/60">Entradas, salidas, estado actual y fecha de salida programada.</p>
          </div>
          <button
            onClick={fetchMantenimientos}
            className="rounded-xl bg-black/25 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
          >
            Refrescar
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full border-collapse bg-black/20 text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Serie</th>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">Tipo mant.</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Entrada taller</th>
                <th className="px-4 py-3">Salida taller</th>
                <th className="px-4 py-3">Inicio mant.</th>
                <th className="px-4 py-3">Término mant.</th>
                <th className="px-4 py-3">Salida programada</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-t border-white/10">
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-white/60 animate-pulse">
                    Cargando mantenimientos...
                  </td>
                </tr>
              ) : mantenimientos.length === 0 ? (
                <tr className="border-t border-white/10">
                  <td colSpan={9} className="px-4 py-6 text-center text-sm text-white/60">
                    Sin datos.
                  </td>
                </tr>
              ) : (
                mantenimientos.map((item) => (
                  <tr key={item.folio} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono text-xs text-white/80">{item.num_serie}</td>
                    <td className="px-4 py-3 text-white/80">{item.matricula}</td>
                    <td className="px-4 py-3 text-white/80">{item.tipo_mantenimiento}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          item.estado_mantenimiento === "EN_MANTENIMIENTO"
                            ? "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                            : "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
                        ].join(" ")}
                      >
                        {item.estado_mantenimiento === "EN_MANTENIMIENTO" ? "En mantenimiento" : "Finalizado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/80">{formatDateTime(item.fecha_ingreso_taller)}</td>
                    <td className="px-4 py-3 text-white/80">{formatDateTime(item.fecha_egreso_taller)}</td>
                    <td className="px-4 py-3 text-white/80">{formatDateTime(item.fecha_inicio_mantenimiento)}</td>
                    <td className="px-4 py-3 text-white/80">{formatDateTime(item.fecha_termino_mantenimiento)}</td>
                    <td className="px-4 py-3 text-white/80">{formatDateTime(item.fecha_salida_programada)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
