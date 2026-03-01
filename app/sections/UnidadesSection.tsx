"use client";

import { useMemo, useState, useEffect } from "react";
import { API_BASE, formatDateTime, Tipo, Vehiculo, VehiculoDetalle } from "./common";

export function UnidadesSection() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [estatus, setEstatus] = useState("Todos");

  const [detalle, setDetalle] = useState<VehiculoDetalle | null>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);

  const [editTarget, setEditTarget] = useState<Vehiculo | null>(null);
  const [editForm, setEditForm] = useState({ matricula: "", estatus: "", id_tipo: "" });
  const [editInitial, setEditInitial] = useState({ matricula: "", estatus: "", id_tipo: "" });
  const [editHydrateLoading, setEditHydrateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVehiculos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/vehiculos`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      setVehiculos(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVehiculos().catch(() => {});
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/tipos`).then((r) => r.json()).then(setTipos).catch(() => {});
  }, []);

  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter((v) => {
      const matchSearch =
        search.trim() === "" ||
        v.num_serie.toLowerCase().includes(search.toLowerCase()) ||
        (v.descripcion ?? v.tipo ?? "").toLowerCase().includes(search.toLowerCase());
      const matchEstatus = estatus === "Todos" || v.estatus === estatus;
      return matchSearch && matchEstatus;
    });
  }, [vehiculos, search, estatus]);

  const handleVer = async (num_serie: string) => {
    setDetalle(null);
    setDetalleError(null);
    setDetalleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(num_serie)}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setDetalle(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      setDetalleError(err instanceof Error ? err.message : "Error al cargar detalle");
    } finally {
      setDetalleLoading(false);
    }
  };

  const handleEditOpen = async (v: Vehiculo) => {
    setEditTarget(v);
    setEditError(null);
    setEditHydrateLoading(true);
    try {
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(v.num_serie)}`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const detalleData = (Array.isArray(data) ? data[0] : data) as VehiculoDetalle;
      const tipoId = detalleData?.id_tipo ? String(detalleData.id_tipo) : "";
      const nextForm = {
        matricula: detalleData?.matricula ?? "",
        estatus: detalleData?.estatus ?? v.estatus,
        id_tipo: tipoId,
      };
      setEditForm(nextForm);
      setEditInitial(nextForm);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al cargar valores actuales");
      setEditForm({ matricula: "", estatus: v.estatus, id_tipo: "" });
      setEditInitial({ matricula: "", estatus: v.estatus, id_tipo: "" });
    } finally {
      setEditHydrateLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    setEditError(null);
    const body: Record<string, string | number> = {};
    if (editForm.matricula.trim() !== editInitial.matricula.trim()) body.matricula = editForm.matricula.trim();
    if (editForm.estatus !== editInitial.estatus) body.estatus = editForm.estatus;
    if (editForm.id_tipo !== editInitial.id_tipo && editForm.id_tipo) body.id_tipo = Number(editForm.id_tipo);
    if (Object.keys(body).length === 0) {
      setEditError("Ingresa al menos un campo para actualizar.");
      setEditLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(editTarget.num_serie)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `Error ${res.status}`);
      }
      showToast("Vehículo actualizado correctamente.", "ok");
      setEditTarget(null);
      fetchVehiculos();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(deleteTarget.num_serie)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `Error ${res.status}`);
      }
      showToast(`Vehículo ${deleteTarget.num_serie} eliminado.`, "ok");
      setDeleteTarget(null);
      fetchVehiculos();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleExport = async () => {
    const response = await fetch(`${API_BASE}/vehiculos/export`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehiculos.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {toast && (
        <div
          className={[
            "fixed bottom-5 right-5 z-[100] rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ring-1",
            toast.type === "ok"
              ? "bg-emerald-500/20 text-emerald-200 ring-emerald-400/30"
              : "bg-rose-500/20 text-rose-200 ring-rose-400/30",
          ].join(" ")}
        >
          {toast.msg}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <label className="text-xs text-white/60">Buscar</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Número de serie o tipo..."
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/35 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/60">Estatus</label>
            <select
              value={estatus}
              onChange={(e) => setEstatus(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              <option>Todos</option>
              <option>ACTIVO</option>
              <option>INACTIVO</option>
              <option>MANTENIMIENTO</option>
            </select>
          </div>
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
                <th className="px-4 py-3 w-48">Número de serie</th>
                <th className="px-4 py-3 w-52">Tipo</th>
                <th className="px-4 py-3 w-36">Estatus</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-white/60 animate-pulse">
                    Cargando vehículos…
                  </td>
                </tr>
              ) : vehiculosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-white/60">
                    No se encontraron vehículos.
                  </td>
                </tr>
              ) : (
                vehiculosFiltrados.map((v) => (
                  <tr key={v.num_serie} className="border-t border-white/10 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-white/80">{v.num_serie}</td>
                    <td className="px-4 py-3 text-white/80">{v.descripcion ?? v.tipo ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          v.estatus === "ACTIVO"
                            ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30"
                            : v.estatus === "MANTENIMIENTO"
                              ? "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                              : "bg-rose-500/10 text-rose-300 ring-rose-400/30",
                        ].join(" ")}
                      >
                        {v.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleVer(v.num_serie)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10 transition-colors"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEditOpen(v)}
                          className="rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold ring-1 ring-indigo-400/30 hover:bg-indigo-500/30 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(v);
                            setDeleteError(null);
                          }}
                          className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-rose-400/30 hover:bg-rose-500/25 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>{!loading && vehiculos.length > 0 ? `${vehiculosFiltrados.length} de ${vehiculos.length} vehículo(s).` : ""}</span>
          <div className="flex items-center gap-3">
            <span>
              Endpoints: <code className="text-white/70">POST</code>, <code className="text-white/70">PATCH</code>,{" "}
              <code className="text-white/70">DELETE</code>.
            </span>
            <button
              onClick={handleExport}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 font-semibold ring-1 ring-emerald-400/30 hover:bg-emerald-500/30"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </section>

      {(detalle || detalleLoading || detalleError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDetalle(null);
              setDetalleError(null);
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold">Detalle del vehículo</h2>
                {detalle && <p className="mt-0.5 font-mono text-xs text-white/50">{detalle.num_serie}</p>}
              </div>
              <button
                onClick={() => {
                  setDetalle(null);
                  setDetalleError(null);
                }}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                Cerrar ✕
              </button>
            </div>
            {detalleLoading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            )}
            {detalleError && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {detalleError}
              </div>
            )}
            {detalle && !detalleLoading && (
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { label: "ID Vehículo", value: detalle.id_vehiculo },
                  { label: "Número de serie", value: detalle.num_serie },
                  { label: "Matrícula", value: detalle.matricula },
                  { label: "Tipo", value: detalle.descripcion },
                  { label: "Estatus", value: detalle.estatus, badge: true },
                  { label: "En mantenimiento", value: detalle.en_mantenimiento },
                  { label: "Tipo mantenimiento", value: detalle.tipo_mantenimiento ?? "—" },
                  { label: "Ingreso a taller", value: formatDateTime(detalle.fecha_ingreso_taller) },
                  { label: "Inicio mantenimiento", value: formatDateTime(detalle.fecha_inicio_mantenimiento) },
                  { label: "Término mantenimiento", value: formatDateTime(detalle.fecha_termino_mantenimiento) },
                  { label: "Egreso de taller", value: formatDateTime(detalle.fecha_egreso_taller) },
                ].map(({ label, value, badge }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <dt className="text-xs text-white/50">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white/90">
                      {badge ? (
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                            value === "ACTIVO"
                              ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30"
                              : value === "MANTENIMIENTO"
                                ? "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                                : "bg-rose-500/10 text-rose-300 ring-rose-400/30",
                          ].join(" ")}
                        >
                          {value}
                        </span>
                      ) : (
                        String(value ?? "—")
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}

      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditTarget(null);
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold">Editar vehículo</h2>
                <p className="mt-0.5 font-mono text-xs text-white/50">{editTarget.num_serie}</p>
              </div>
              <button
                onClick={() => setEditTarget(null)}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60">Matrícula</label>
                <input
                  value={editForm.matricula}
                  onChange={(e) => setEditForm((f) => ({ ...f, matricula: e.target.value }))}
                  placeholder="Ej. ABC1234"
                  disabled={editHydrateLoading}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:ring-2 focus:ring-indigo-400/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Estatus</label>
                <select
                  value={editForm.estatus}
                  onChange={(e) => setEditForm((f) => ({ ...f, estatus: e.target.value }))}
                  disabled={editHydrateLoading}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/60">Tipo de vehículo</label>
                <select
                  value={editForm.id_tipo}
                  onChange={(e) => setEditForm((f) => ({ ...f, id_tipo: e.target.value }))}
                  disabled={editHydrateLoading}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option value="">— Selecciona tipo —</option>
                  {tipos.map((t) => (
                    <option key={t.id_tipo} value={t.id_tipo}>
                      {t.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              {editHydrateLoading && <p className="text-xs text-white/55">Cargando matrícula y tipo actuales...</p>}
              {editError && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
                  {editError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditTarget(null)}
                  className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={editLoading || editHydrateLoading}
                  className="rounded-xl bg-indigo-500/30 px-4 py-2 text-sm font-semibold ring-1 ring-indigo-400/30 hover:bg-indigo-500/40 disabled:opacity-50"
                >
                  {editLoading ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
            <h2 className="text-lg font-bold">¿Eliminar vehículo?</h2>
            <p className="mt-2 text-sm text-white/60">Esta acción no se puede deshacer. Se eliminará el vehículo:</p>
            <p className="mt-2 font-mono text-sm text-rose-300">{deleteTarget.num_serie}</p>
            {deleteError && (
              <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
                {deleteError}
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="rounded-xl bg-rose-500/30 px-4 py-2 text-sm font-semibold ring-1 ring-rose-400/30 hover:bg-rose-500/40 disabled:opacity-50"
              >
                {deleteLoading ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
