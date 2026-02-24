"use client";

import { useMemo, useState, useEffect } from "react";

type NavKey = "dashboard" | "unidades" | "tipos" |"tipos_mant"| "config";

import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer,Legend,} from "recharts";



const NAV: { key: NavKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "unidades", label: "Vehiculos" },
  { key: "tipos", label: "Tipos" },
  { key: "tipos_mant", label: "Tipos de mantenimiento" },
  { key: "config", label: "Config" },
];

interface Vehiculo {
  num_serie: string;
  tipo?: string;
  descripcion?: string;
  estatus: "ACTIVO" | "INACTIVO" | "MANTENIMIENTO" | string;
}

interface VehiculoDetalle {
  id_vehiculo: number;
  num_serie: string;
  matricula: string;
  descripcion: string;
  estatus: string;
  en_mantenimiento: "SI" | "NO";
}
interface TipoVehiculo {
  id_tipo: number;
  descripcion: string;
}
interface TipoMantenimiento{
  id_tipo_mantenimiento: number;
  nombre: string; 
  descripcion:string;
}

interface Tipo {
  id_tipo: number;
  descripcion: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function Home() {
  const [active, setActive] = useState<NavKey>("dashboard");

  const title = useMemo(() => {
    switch (active) {
      case "dashboard":
        return { h1: "Dashboard", p: "Resumen y métricas del sistema" };
      case "unidades":
        return { h1: "Vehiculos", p: "Consulta, filtros, acciones y detalle" };
      case "tipos":
        return { h1: "Tipos de vehículo", p: "Catálogo y consultas" };
       case "tipos_mant":
        return { h1: "Tipos de Mantenimiento", p:"Catalogo de mantenimientos" };
      case "config":
        return { h1: "Configuración", p: "Ajustes del panel y entorno" };
    }
  }, [active]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4 md:block">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
              <span className="text-sm font-bold">UV</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Panel</p>
              <p className="text-xs text-white/60">Control de Vehiculos</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                  active === item.key
                    ? "bg-white/10 font-semibold"
                    : "text-white/70 hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/70">
            Listo para integrar: filtros, tabla, modales, stats, export, etc.
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-4">
          {/* Topbar */}
          <header className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title.h1}</h1>
              <p className="mt-1 text-sm text-white/60">{title.p}</p>
            </div>
            <div className="flex flex-wrap gap-2"></div>
          </header>

          {active === "dashboard" && <DashboardSection />}
          {active === "unidades" && <UnidadesSection />}
          {active === "tipos" && <TiposSection />}
           {active === "tipos_mant" && <TiposMantenimientoSection />}
          {active === "config" && <ConfigSection />}

          <footer className="text-xs text-white/45">

          </footer>
        </main>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD
   ========================= */

function DashboardSection() {
    /*Objeto para los datos de los vehiculos*/
    // Se inicializa en null hasta que la API responde
  const [stats, setStats] = useState<{
    total: number;
    activos: number;
    inactivos: number;
    mantenimientos: number;
  } | null>(null);
// Controla si estamos esperando la respuesta del servidor (para mostrar skeletons o loaders)
  const [loading, setLoading] = useState(true);
  // Colores  para las rebanadas de la gráfica de pastel
  const COLORS = ["#2DD4BF", "#FB7185", "#FBBF24"];
  // Prepara los datos en el formato que Recharts necesita: [{name: 'Etiqueta', value: 10}, ...]
  // Si stats es null, devuelve un array vacío
   const chartData = stats
  ? [
      { name: "Activos", value: stats.activos },
      { name: "Inactivos", value: stats.inactivos },
      { name: "Mantenimiento", value: stats.mantenimientos },
    ]
  : [];
  useEffect(() => {
      // Función asíncrona para obtener datos del backend (FastAPI)
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/vehiculos/estatus`);
        const data = await res.json();
        // Guardamos los datos en el estado
        setStats(data);
      } catch (error) {
        console.error("Error cargando stats:", error);
      } finally {
          // Quitamos el estado de carga sin importar si hubo éxito o error
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="KPIs">
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="Total" value={stats?.total} loading={loading} />
          <KpiCard label="Activos" value={stats?.activos} loading={loading} />
          <KpiCard label="Inactivos" value={stats?.inactivos} loading={loading} />
          <KpiCard label="Mantenimiento" value={stats?.mantenimientos} loading={loading} />
        </div>
      </Card>

      <Card title="Estado de Unidades">
  <div className="h-72 w-full">
    {!loading && stats ? (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-white/50">
        Cargando gráfica...
      </div>
    )}
  </div>
</Card>
    </section>
  );
}

/* =========================
   UNIDADES
   ========================= */

function UnidadesSection() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [estatus, setEstatus] = useState("Todos");

  // Detalle
  const [detalle, setDetalle] = useState<VehiculoDetalle | null>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState<string | null>(null);

  // Editar
  const [editTarget, setEditTarget] = useState<Vehiculo | null>(null);
  const [editForm, setEditForm] = useState({ matricula: "", estatus: "", id_tipo: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [tipos, setTipos] = useState<Tipo[]>([]);

  // Eliminar
  const [deleteTarget, setDeleteTarget] = useState<Vehiculo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Toast
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

  useEffect(() => { fetchVehiculos(); }, []);

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

  const handleEditOpen = (v: Vehiculo) => {
    setEditTarget(v);
    setEditForm({ matricula: "", estatus: v.estatus, id_tipo: "" });
    setEditError(null);
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    setEditLoading(true);
    setEditError(null);
    const body: Record<string, string | number> = {};
    if (editForm.matricula.trim()) body.matricula = editForm.matricula.trim();
    if (editForm.estatus) body.estatus = editForm.estatus;
    if (editForm.id_tipo) body.id_tipo = Number(editForm.id_tipo);
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
      {/* Toast */}
      {toast && (
        <div className={[
          "fixed bottom-5 right-5 z-[100] rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ring-1",
          toast.type === "ok"
            ? "bg-emerald-500/20 text-emerald-200 ring-emerald-400/30"
            : "bg-rose-500/20 text-rose-200 ring-rose-400/30",
        ].join(" ")}>
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
                      <span className={[
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                        v.estatus === "ACTIVO"
                          ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30"
                          : v.estatus === "MANTENIMIENTO"
                          ? "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                          : "bg-rose-500/10 text-rose-300 ring-rose-400/30",
                      ].join(" ")}>
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
                          onClick={() => { setDeleteTarget(v); setDeleteError(null); }}
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
          <span>
            {!loading && vehiculos.length > 0
              ? `${vehiculosFiltrados.length} de ${vehiculos.length} vehículo(s).`
              : ""}
          </span>
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

      {/* ── Modal detalle ── */}
      {(detalle || detalleLoading || detalleError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setDetalle(null); setDetalleError(null); } }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-bold">Detalle del vehículo</h2>
                {detalle && <p className="mt-0.5 font-mono text-xs text-white/50">{detalle.num_serie}</p>}
              </div>
              <button
                onClick={() => { setDetalle(null); setDetalleError(null); }}
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
                  { label: "ID Vehículo",     value: detalle.id_vehiculo },
                  { label: "Número de serie",  value: detalle.num_serie },
                  { label: "Matrícula",        value: detalle.matricula },
                  { label: "Tipo",             value: detalle.descripcion },
                  { label: "Estatus",          value: detalle.estatus, badge: true },
                  { label: "En mantenimiento", value: detalle.en_mantenimiento },
                ].map(({ label, value, badge }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <dt className="text-xs text-white/50">{label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-white/90">
                      {badge ? (
                        <span className={[
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                          value === "ACTIVO"
                            ? "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30"
                            : value === "MANTENIMIENTO"
                            ? "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                            : "bg-rose-500/10 text-rose-300 ring-rose-400/30",
                        ].join(" ")}>{value}</span>
                      ) : String(value ?? "—")}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}

      {/* ── Modal editar ── */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
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
                  placeholder="Dejar vacío para no cambiar"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:ring-2 focus:ring-indigo-400/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/60">Estatus</label>
                <select
                  value={editForm.estatus}
                  onChange={(e) => setEditForm((f) => ({ ...f, estatus: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option value="">— Sin cambio —</option>
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
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/30"
                >
                  <option value="">— Sin cambio —</option>
                  {tipos.map((t) => (
                    <option key={t.id_tipo} value={t.id_tipo}>{t.descripcion}</option>
                  ))}
                </select>
              </div>
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
                  disabled={editLoading}
                  className="rounded-xl bg-indigo-500/30 px-4 py-2 text-sm font-semibold ring-1 ring-indigo-400/30 hover:bg-indigo-500/40 disabled:opacity-50"
                >
                  {editLoading ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal confirmar eliminación ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6">
            <h2 className="text-lg font-bold">¿Eliminar vehículo?</h2>
            <p className="mt-2 text-sm text-white/60">
              Esta acción no se puede deshacer. Se eliminará el vehículo:
            </p>
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

/* =========================
   TIPOS
   ========================= */

function TiposSection() {
  const [tipos, setTipos] = useState<TipoVehiculo[]>([]);

  const fetchTipos = async () => {
    const response = await fetch("http://127.0.0.1:8000/tipos_vehiculos");
    const data = await response.json();
    setTipos(data);
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tipos de vehículo</h2>
          <p className="mt-1 text-sm text-white/60">
            Catálogo para consultar descripciones (sin modificar BD).
          </p>
        </div>
        <button className="rounded-xl bg-black/25 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"/>

        <button
          onClick={fetchTipos}
          className="rounded-xl bg-black/25 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10">
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
function TiposMantenimientoSection() {
  const [tiposMant, setTiposMant] = useState<TipoMantenimiento[]>([]);

  const fetchTipos_mant = async () => {
    const response = await fetch("http://127.0.0.1:8000/vehiculos/mantenimiento/tipo_mantenimiento");
    const data = await response.json();
    setTiposMant(data);
  };

  useEffect(() => {
    fetchTipos_mant();
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Tipos de Mantenimiento</h2>
          <p className="mt-1 text-sm text-white/60">
            Catálogo para consultar descripciones (sin modificar BD).
          </p>
        </div>

        <button
          onClick={fetchTipos_mant}
          className="rounded-xl bg-black/25 px-4 py-2 text-sm font-semibold ring-1 ring-white/10 hover:bg-white/10"
        >
          Refrescar
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full border-collapse bg-black/20 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {tiposMant.length === 0 ? (
              <tr className="border-t border-white/10">
                <td colSpan={2} className="px-4 py-6 text-center text-sm text-white/60">
                  Sin datos.
                </td>
              </tr>
            ) : (
              tiposMant.map((tipoMant) => (
                <tr key={tipoMant.id_tipo_mantenimiento} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/80">{tipoMant.nombre}</td>
                  <td className="px-4 py-3 text-white/80">{tipoMant.descripcion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* =========================
   CONFIG
   ========================= */

function ConfigSection() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card title="Entorno">
        <div className="space-y-2 text-sm text-white/70">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-white/60">API URL</p>
            <p className="mt-1 font-mono text-xs text-white/80">NEXT_PUBLIC_API_URL</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-xs text-white/60">Modo</p>
            <p className="mt-1 text-sm">Desarrollo</p>
          </div>
        </div>
      </Card>

      <Card title="Ayuda">
        <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
          <li>Conectar endpoints con fetch/axios.</li>
          <li>Usar modales para crear/editar/eliminar.</li>
          <li>Agregar toasts para feedback al usuario.</li>
          <li>Agregar paginación y ordenamiento a la tabla.</li>
        </ul>
      </Card>
    </section>
  );
}

/* =========================
   UI HELPERS
   ========================= */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function KpiCard({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <div className="mt-2 text-2xl font-bold">
        {loading ? (
          <div className="h-7 w-16 animate-pulse rounded-lg bg-white/10" />
        ) : (
          value ?? 0
        )}
      </div>
    </div>
  );
}