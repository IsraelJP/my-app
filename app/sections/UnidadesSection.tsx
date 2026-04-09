"use client";

import { useMemo, useState, useEffect } from "react";
import { THEME } from "../theme";
import { API_BASE, formatDateTime, Tipo, Vehiculo, VehiculoDetalle } from "./common";

function estatusBadge(estatus: string) {
  if (estatus === "ACTIVO")        return THEME.badgeActivo;
  if (estatus === "MANTENIMIENTO") return THEME.badgeMantenimiento;
  return THEME.badgeInactivo;
}

function EmptyState() {
  return (
    <div className={`rounded-2xl ${THEME.surface} p-12 shadow-sm flex flex-col items-center gap-4 text-center`}>
      <div className={`grid h-16 w-16 place-items-center rounded-2xl ${THEME.logo} text-3xl`}>
        🚌
      </div>
      <div>
        <p className={`text-base font-semibold ${THEME.heading}`}>Busca un vehículo para comenzar</p>
        <p className={`mt-1 text-sm ${THEME.body}`}>
          Ingresa un número de serie, matrícula o tipo en el campo de búsqueda.
        </p>
      </div>
    </div>
  );
}

export function UnidadesSection() {
  // Búsqueda
  const [query, setQuery]             = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filtroTipo, setFiltroTipo]     = useState("");
  const [filtroEstatus, setFiltroEstatus] = useState("");
  // TODO: agregar filtro de marca cuando se añada al esquema de BD

  // Datos
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [tipos, setTipos]         = useState<Tipo[]>([]);

  // Modal: Ver detalle
  const [detalle, setDetalle]               = useState<VehiculoDetalle | null>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError]     = useState<string | null>(null);

  // Modal: Editar
  const [editTarget, setEditTarget]                 = useState<Vehiculo | null>(null);
  const [editForm, setEditForm]                     = useState({ matricula: "", estatus: "", id_tipo: "" });
  const [editInitial, setEditInitial]               = useState({ matricula: "", estatus: "", id_tipo: "" });
  const [editHydrateLoading, setEditHydrateLoading] = useState(false);
  const [editLoading, setEditLoading]               = useState(false);
  const [editError, setEditError]                   = useState<string | null>(null);

  // Modal: Eliminar
  const [deleteTarget, setDeleteTarget]   = useState<Vehiculo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError]     = useState<string | null>(null);

  // Modal: Nuevo vehículo
  const [showCreate, setShowCreate]       = useState(false);
  const [createForm, setCreateForm]       = useState({ num_serie: "", matricula: "", id_tipo: "", estatus: "ACTIVO" });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError]     = useState<string | null>(null);

  //Modal Insertar- Mantenimiento
    const [mantTarget, setMantTarget] = useState<Vehiculo | null>(null);
    const [mantForm, setMantForm] = useState({id_tipo_mantenimiento: "", fecha_inicio: ""});
    const [mantLoading, setMantLoading] = useState(false);
    const [mantError, setMantError] = useState<string | null>(null);
  // Toast
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`${API_BASE}/tipos`).then((r) => r.json()).then(setTipos).catch(() => {});
  }, []);

  // Tipos únicos derivados de los vehículos cargados (para el selector de filtro)
  const tiposEnResultados = useMemo(() => {
    const set = new Set<string>();
    vehiculos.forEach((v) => { if (v.descripcion) set.add(v.descripcion); });
    return Array.from(set).sort();
  }, [vehiculos]);

  // Conteo de filtros activos (para el badge del botón)
  const filtrosActivos = [filtroTipo, filtroEstatus].filter(Boolean).length;
  // TODO: incluir filtro de marca en el conteo cuando se implemente

  const handleSearch = async () => {
    setHasSearched(true);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const limpiarFiltros = () => {
    setFiltroTipo("");
    setFiltroEstatus("");
    // TODO: limpiar filtro de marca cuando se implemente
  };

  const vehiculosFiltrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehiculos.filter((v) => {
      const matchQuery =
        q === "" ||
        v.num_serie.toLowerCase().includes(q) ||
        (v.descripcion ?? v.tipo ?? "").toLowerCase().includes(q);
      const matchTipo   = !filtroTipo   || (v.descripcion ?? v.tipo ?? "") === filtroTipo;
      const matchEstatus = !filtroEstatus || v.estatus === filtroEstatus;
      // TODO: agregar matchMarca cuando el campo esté disponible en la BD
      return matchQuery && matchTipo && matchEstatus;
    });
  }, [vehiculos, query, filtroTipo, filtroEstatus]);

  // ── Handlers CRUD ──────────────────────────────────────────────────────────

  const handleVer = async (num_serie: string) => {
    setDetalle(null);
    setDetalleError(null);
    setDetalleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(num_serie)}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
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
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const d = (Array.isArray(data) ? data[0] : data) as VehiculoDetalle;
      const next = { matricula: d?.matricula ?? "", estatus: d?.estatus ?? v.estatus, id_tipo: d?.id_tipo ? String(d.id_tipo) : "" };
      setEditForm(next);
      setEditInitial(next);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al cargar datos");
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
      showToast("Vehículo actualizado.", "ok");
      setEditTarget(null);
      handleSearch();
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
      const res = await fetch(`${API_BASE}/vehiculos/${encodeURIComponent(deleteTarget.num_serie)}`, { method: "DELETE" });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `Error ${res.status}`);
      }
      showToast(`Vehículo ${deleteTarget.num_serie} eliminado.`, "ok");
      setDeleteTarget(null);
      handleSearch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateSave = async () => {
    setCreateLoading(true);
    setCreateError(null);
    if (!createForm.num_serie.trim() || !createForm.matricula.trim() || !createForm.id_tipo) {
      setCreateError("Todos los campos son obligatorios.");
      setCreateLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/vehiculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          num_serie: createForm.num_serie.trim(),
          matricula: createForm.matricula.trim(),
          id_tipo:   Number(createForm.id_tipo),
          estatus:   createForm.estatus,
        }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail ?? `Error ${res.status}`);
      }
      showToast("Vehículo creado correctamente.", "ok");
      setShowCreate(false);
      setCreateForm({ num_serie: "", matricula: "", id_tipo: "", estatus: "ACTIVO" });
      handleSearch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Error al crear");
    } finally {
      setCreateLoading(false);
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

    //Handle de mantenimiento, insertar
    const handleMantenimientoOpen = (v: Vehiculo) => {
      if (v.estatus !== "ACTIVO") return;

      setMantTarget(v);
      setMantError(null);

      setMantForm({
        id_tipo_mantenimiento: "",
        fecha_inicio: new Date().toISOString().slice(0,16)
      });
    };
    const handleCrearMantenimiento = async () => {
      if (!mantTarget) return;

      if (!mantForm.id_tipo_mantenimiento || !mantForm.fecha_inicio) {
        setMantError("Todos los campos son obligatorios.");
        return;
      }

      setMantLoading(true);
      setMantError(null);

      try {
        const res = await fetch(`${API_BASE}/mantenimientos/insertar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            num_serie: mantTarget.num_serie,
            id_tipo_mantenimiento: Number(mantForm.id_tipo_mantenimiento),
            fecha_inicio_mantenimiento: mantForm.fecha_inicio
          }),
        });

        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.detail ?? `Error ${res.status}`);
        }

        showToast("Mantenimiento iniciado.", "ok");
        setMantTarget(null);
        handleSearch();

      } catch (err) {
        setMantError(err instanceof Error ? err.message : "Error al guardar");
      } finally {
        setMantLoading(false);
      }
    };
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[100] ${toast.type === "ok" ? THEME.toastOk : THEME.toastErr}`}>
          {toast.msg}
        </div>
      )}

      {/* Barra de búsqueda */}
      <section className={`rounded-2xl ${THEME.surface} p-4 shadow-sm`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className={THEME.label}>Buscar vehículo</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Número de serie o tipo de vehículo…"
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>
          <button onClick={handleSearch} className={THEME.btnPrimary}>Buscar</button>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={[
              THEME.btnSecondary,
              showFilters ? "ring-indigo-300 text-indigo-600" : "",
            ].join(" ")}
          >
            Filtros
            {filtrosActivos > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                {filtrosActivos}
              </span>
            )}
          </button>
          <button onClick={() => { setShowCreate(true); setCreateError(null); }} className={THEME.btnSecondary}>
            + Nuevo
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className={`mt-4 rounded-xl ${THEME.inset} p-4`}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* TODO: agregar filtro de Marca cuando se añada el campo a la tabla VEHICULOS */}

              <div>
                <label className={THEME.label}>Tipo de vehículo</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className={`mt-1 w-full ${THEME.select}`}
                >
                  <option value="">Todos los tipos</option>
                  {tiposEnResultados.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={THEME.label}>Estatus</label>
                <select
                  value={filtroEstatus}
                  onChange={(e) => setFiltroEstatus(e.target.value)}
                  className={`mt-1 w-full ${THEME.select}`}
                >
                  <option value="">Todos</option>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>
            </div>

            {filtrosActivos > 0 && (
              <button onClick={limpiarFiltros} className={`mt-3 text-xs ${THEME.body} underline underline-offset-2`}>
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </section>

      {/* Estado vacío / resultados */}
      {!hasSearched ? (
        <EmptyState />
      ) : (
        <section className={`rounded-2xl ${THEME.surface} p-4 shadow-sm`}>
          {error && <div className={`mb-4 ${THEME.errorBox}`}>{error}</div>}

          <div className={THEME.tableWrapper}>
            <table className={THEME.table}>
              <thead className={THEME.thead}>
                <tr>
                  <th className={`${THEME.th} w-48`}>Número de serie</th>
                  <th className={`${THEME.th} w-52`}>Tipo</th>
                  <th className={`${THEME.th} w-36`}>Estatus</th>
                  <th className={`${THEME.th} text-right`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className={`px-4 py-6 text-center text-sm ${THEME.muted} animate-pulse`}>
                      Buscando vehículos…
                    </td>
                  </tr>
                ) : vehiculosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={`px-4 py-10 text-center text-sm ${THEME.muted}`}>
                      No se encontraron vehículos con esos criterios.
                    </td>
                  </tr>
                ) : (
                  vehiculosFiltrados.map((v) => (
                    <tr key={v.num_serie} className={THEME.trow}>
                      <td className={THEME.tcellMono}>{v.num_serie}</td>
                      <td className={THEME.tcell}>{v.descripcion ?? v.tipo ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${estatusBadge(v.estatus)}`}>
                          {v.estatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => handleVer(v.num_serie)}                              className={THEME.btnGhost}>Ver</button>
                          <button onClick={() => handleEditOpen(v)}                                   className={THEME.btnEdit}>Editar</button>
                          <button onClick={() => { setDeleteTarget(v); setDeleteError(null); }}       className={THEME.btnDelete}>Eliminar</button>
                          {v.estatus === "ACTIVO" && (
                          <button
                            onClick={() => handleMantenimientoOpen(v)}                                className={THEME.btnSecondary}>Mantenimiento</button>)}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && vehiculos.length > 0 && (
            <div className={`mt-4 flex items-center justify-between text-xs ${THEME.muted}`}>
              <span>{vehiculosFiltrados.length} de {vehiculos.length} vehículo(s)</span>
              <button onClick={handleExport} className={THEME.btnSuccess}>Exportar CSV</button>
            </div>
          )}
        </section>
      )}

      {/* ── Modal: Ver detalle ─────────────────────────────────────────────── */}
      {(detalle || detalleLoading || detalleError) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
          onClick={(e) => { if (e.target === e.currentTarget) { setDetalle(null); setDetalleError(null); } }}
        >
          <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className={`text-lg font-bold ${THEME.heading}`}>Detalle del vehículo</h2>
                {detalle && <p className={`mt-0.5 ${THEME.mono}`}>{detalle.num_serie}</p>}
              </div>
              <button onClick={() => { setDetalle(null); setDetalleError(null); }} className={THEME.btnGhost}>Cerrar ✕</button>
            </div>
            {detalleLoading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className={THEME.skeleton} />)}
              </div>
            )}
            {detalleError && <div className={THEME.errorBox}>{detalleError}</div>}
            {detalle && !detalleLoading && (
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { label: "ID",                    value: detalle.id_vehiculo },
                  { label: "Número de serie",       value: detalle.num_serie },
                  { label: "Matrícula",             value: detalle.matricula },
                  { label: "Tipo",                  value: detalle.descripcion },
                  { label: "Estatus",               value: detalle.estatus, badge: true },
                  { label: "En mantenimiento",      value: detalle.en_mantenimiento },
                  { label: "Tipo mantenimiento",    value: detalle.tipo_mantenimiento ?? "—" },
                  { label: "Ingreso a taller",      value: formatDateTime(detalle.fecha_ingreso_taller) },
                  { label: "Inicio mantenimiento",  value: formatDateTime(detalle.fecha_inicio_mantenimiento) },
                  { label: "Término mantenimiento", value: formatDateTime(detalle.fecha_termino_mantenimiento) },
                  { label: "Egreso de taller",      value: formatDateTime(detalle.fecha_egreso_taller) },
                ].map(({ label, value, badge }) => (
                  <div key={label} className={`rounded-xl ${THEME.inset} px-3 py-2`}>
                    <dt className={THEME.label}>{label}</dt>
                    <dd className={`mt-0.5 text-sm font-medium ${THEME.heading}`}>
                      {badge ? (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${estatusBadge(String(value))}`}>
                          {value}
                        </span>
                      ) : String(value ?? "—")}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}

      {/* ── Modal: Editar ─────────────────────────────────────────────────── */}
      {editTarget && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
          onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
        >
          <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className={`text-lg font-bold ${THEME.heading}`}>Editar vehículo</h2>
                <p className={`mt-0.5 ${THEME.mono}`}>{editTarget.num_serie}</p>
              </div>
              <button onClick={() => setEditTarget(null)} className={THEME.btnGhost}>Cerrar ✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={THEME.label}>Matrícula</label>
                <input value={editForm.matricula} onChange={(e) => setEditForm((f) => ({ ...f, matricula: e.target.value }))}
                  placeholder="Ej. ABC1234" disabled={editHydrateLoading} className={`mt-1 w-full ${THEME.input}`} />
              </div>
              <div>
                <label className={THEME.label}>Estatus</label>
                <select value={editForm.estatus} onChange={(e) => setEditForm((f) => ({ ...f, estatus: e.target.value }))}
                  disabled={editHydrateLoading} className={`mt-1 w-full ${THEME.select}`}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>
              <div>
                <label className={THEME.label}>Tipo de vehículo</label>
                <select value={editForm.id_tipo} onChange={(e) => setEditForm((f) => ({ ...f, id_tipo: e.target.value }))}
                  disabled={editHydrateLoading} className={`mt-1 w-full ${THEME.select}`}>
                  <option value="">— Selecciona tipo —</option>
                  {tipos.map((t) => <option key={t.id_tipo} value={t.id_tipo}>{t.descripcion}</option>)}
                </select>
              </div>
              {editHydrateLoading && <p className={`text-xs ${THEME.muted}`}>Cargando datos actuales...</p>}
              {editError && <div className={THEME.errorBox}>{editError}</div>}
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setEditTarget(null)} className={THEME.btnSecondary}>Cancelar</button>
                <button onClick={handleEditSave} disabled={editLoading || editHydrateLoading} className={THEME.btnPrimary}>
                  {editLoading ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Eliminar ───────────────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div className={`relative w-full max-w-sm rounded-2xl ${THEME.surface} shadow-2xl p-6`}>
            <h2 className={`text-lg font-bold ${THEME.heading}`}>¿Eliminar vehículo?</h2>
            <p className={`mt-2 text-sm ${THEME.body}`}>Esta acción no se puede deshacer. Se eliminará:</p>
            <p className="mt-2 font-mono text-sm font-semibold text-rose-600">{deleteTarget.num_serie}</p>
            {deleteError && <div className={`mt-3 ${THEME.errorBox}`}>{deleteError}</div>}
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className={THEME.btnSecondary}>Cancelar</button>
              <button onClick={handleDeleteConfirm} disabled={deleteLoading} className={THEME.btnDanger}>
                {deleteLoading ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Nuevo vehículo ─────────────────────────────────────────── */}
      {showCreate && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
          onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
        >
          <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <h2 className={`text-lg font-bold ${THEME.heading}`}>Nuevo vehículo</h2>
              <button onClick={() => setShowCreate(false)} className={THEME.btnGhost}>Cerrar ✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={THEME.label}>Número de serie <span className="text-rose-500">*</span></label>
                <input value={createForm.num_serie} onChange={(e) => setCreateForm((f) => ({ ...f, num_serie: e.target.value }))}
                  placeholder="Ej. 1HGCM82633A123456" className={`mt-1 w-full ${THEME.input}`} />
              </div>
              <div>
                <label className={THEME.label}>Matrícula <span className="text-rose-500">*</span></label>
                <input value={createForm.matricula} onChange={(e) => setCreateForm((f) => ({ ...f, matricula: e.target.value }))}
                  placeholder="Ej. ABC1234" className={`mt-1 w-full ${THEME.input}`} />
              </div>
              {/* TODO: agregar campo de Marca cuando se añada a la tabla VEHICULOS */}
              <div>
                <label className={THEME.label}>Tipo de vehículo <span className="text-rose-500">*</span></label>
                <select value={createForm.id_tipo} onChange={(e) => setCreateForm((f) => ({ ...f, id_tipo: e.target.value }))}
                  className={`mt-1 w-full ${THEME.select}`}>
                  <option value="">— Selecciona tipo —</option>
                  {tipos.map((t) => <option key={t.id_tipo} value={t.id_tipo}>{t.descripcion}</option>)}
                </select>
              </div>
              <div>
                <label className={THEME.label}>Estatus inicial</label>
                <select value={createForm.estatus} onChange={(e) => setCreateForm((f) => ({ ...f, estatus: e.target.value }))}
                  className={`mt-1 w-full ${THEME.select}`}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
              </div>
              {createError && <div className={THEME.errorBox}>{createError}</div>}
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowCreate(false)} className={THEME.btnSecondary}>Cancelar</button>
                <button onClick={handleCreateSave} disabled={createLoading} className={THEME.btnPrimary}>
                  {createLoading ? "Creando…" : "Crear vehículo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        {mantTarget && (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
    onClick={(e) => { if (e.target === e.currentTarget) setMantTarget(null); }}
  >
    <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>

      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className={`text-lg font-bold ${THEME.heading}`}>
            Agregar mantenimiento
          </h2>
          <p className={THEME.mono}>{mantTarget.num_serie}</p>
        </div>
        <button onClick={() => setMantTarget(null)} className={THEME.btnGhost}>
          ✕
        </button>
      </div>

      <div className="space-y-4">

        {/* Tipo mantenimiento */}
        <div>
          <label className={THEME.label}>Tipo de mantenimiento</label>
          <select
            value={mantForm.id_tipo_mantenimiento}
            onChange={(e) => setMantForm(f => ({ ...f, id_tipo_mantenimiento: e.target.value }))}
            className={`mt-1 w-full ${THEME.select}`}
          >
            <option value="">— Selecciona —</option>
            <option value="1">Preventivo</option>
            <option value="2">Correctivo</option>
            <option value="3">Mayor</option>
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className={THEME.label}>Fecha de inicio del mantenimiento</label>
          <input
            type="datetime-local"
            value={mantForm.fecha_ingreso}
            onChange={(e) => setMantForm(f => ({ ...f, fecha_inicio: e.target.value }))}
            className={`mt-1 w-full ${THEME.input}`}
          />
        </div>

        {mantError && <div className={THEME.errorBox}>{mantError}</div>}

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setMantTarget(null)} className={THEME.btnSecondary}>
            Cancelar
          </button>

          <button
            onClick={handleCrearMantenimiento}
            disabled={mantLoading}
            className={THEME.btnPrimary}
          >
            {mantLoading ? "Guardando..." : "Iniciar mantenimiento"}
          </button>
        </div>

      </div>
    </div>
  </div>
)}
    </>
  );
}
