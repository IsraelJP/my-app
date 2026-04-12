"use client";

import { useEffect, useState, useMemo } from "react";
import { THEME } from "../theme";
import { API_BASE, Card, formatDateTime, MantenimientoRow, ResumenMantenimientos } from "./common";

type Tab = "activos" | "historial";

function EmptyState({ mensaje }: { mensaje: string }) {
  return (
    <div className={`rounded-2xl ${THEME.surface} p-12 shadow-sm flex flex-col items-center gap-4 text-center`}>
      <div className={`grid h-16 w-16 place-items-center rounded-2xl ${THEME.logo} text-3xl`}>
        🔧
      </div>
      <div>
        <p className={`text-base font-semibold ${THEME.heading}`}>{mensaje}</p>
        <p className={`mt-1 text-sm ${THEME.body}`}>
          Ingresa un número de serie, matrícula o tipo de mantenimiento.
        </p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span className={[
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      estado === "EN_MANTENIMIENTO" ? THEME.badgeEnMantenimiento : THEME.badgeFinalizado,
    ].join(" ")}>
      {estado === "EN_MANTENIMIENTO" ? "En mantenimiento" : "Finalizado"}
    </span>
  );
}

export function TiposMantenimientoSection() {
  const [tab, setTab] = useState<Tab>("activos");
  const [resumen, setResumen] = useState<ResumenMantenimientos>({ en_mantenimiento_total: 0, por_tipo: [] });
  const [resumenLoading, setResumenLoading] = useState(true);
  const [mantenimientos, setMantenimientos] = useState<MantenimientoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Activos
  const [queryActivos, setQueryActivos] = useState("");
  const [showFiltersActivos, setShowFiltersActivos] = useState(false);
  const [filtroNumSerieActivos, setFiltroNumSerieActivos] = useState("");
  const [filtroTipoVehActivos, setFiltroTipoVehActivos] = useState("");

  // Historial
  const [queryHistorial, setQueryHistorial] = useState("");
  const [showFiltersHistorial, setShowFiltersHistorial] = useState(false);
  const [filtroEstadoHist, setFiltroEstadoHist] = useState("");
  const [filtroNumSerieHist, setFiltroNumSerieHist] = useState("");
  const [filtroTipoVehHist, setFiltroTipoVehHist] = useState("");
  const [filtroTipoMantHist, setFiltroTipoMantHist] = useState("");
  const [filtroMarcaHist, setFiltroMarcaHist] = useState("");
  const [filtroFechaIngresoDesde, setFiltroFechaIngresoDesde] = useState("");
  const [filtroFechaIngresoHasta, setFiltroFechaIngresoHasta] = useState("");
  const [filtroFechaInicioDesde, setFiltroFechaInicioDesde] = useState("");
  const [filtroFechaInicioHasta, setFiltroFechaInicioHasta] = useState("");
  const [filtroFechaFinDesde, setFiltroFechaFinDesde] = useState("");
  const [filtroFechaFinHasta, setFiltroFechaFinHasta] = useState("");
  const [filtroFechaSalidaDesde, setFiltroFechaSalidaDesde] = useState("");
  const [filtroFechaSalidaHasta, setFiltroFechaSalidaHasta] = useState("");

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const res = await fetch(`${API_BASE}/mantenimientos/resumen`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResumen(data && typeof data === "object" ? data : { en_mantenimiento_total: 0, por_tipo: [] });
      } catch { /* no crítico */ }
      finally { setResumenLoading(false); }
    };
    fetchResumen();
  }, []);

  const tiposVehiculo = useMemo(() => Array.from(new Set(mantenimientos.map((m) => m.tipo_vehiculo))).sort(), [mantenimientos]);
  const tiposMant = useMemo(() => Array.from(new Set(mantenimientos.map((m) => m.tipo_mantenimiento))).sort(), [mantenimientos]);
  const marcas = useMemo(() => Array.from(new Set(mantenimientos.map((m) => m.marca))).sort(), [mantenimientos]);

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/mantenimientos`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setMantenimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al consultar mantenimientos");
    } finally {
      setLoading(false);
    }
  };

  const verHistorial = (num_serie: string) => {
    setQueryHistorial(num_serie);
    setTab("historial");
    if (!hasSearched) handleSearch();
  };

  const filtradosActivos = useMemo(() => {
    const q = queryActivos.trim().toLowerCase();
    return mantenimientos.filter((m) => {
      if (m.estado_mantenimiento !== "EN_MANTENIMIENTO") return false;
      const matchQuery = !q || m.num_serie.toLowerCase().includes(q) || m.matricula.toLowerCase().includes(q) || m.tipo_mantenimiento.toLowerCase().includes(q);
      const matchNumSerie = !filtroNumSerieActivos || m.num_serie.toLowerCase().includes(filtroNumSerieActivos.toLowerCase());
      const matchTipoVeh = !filtroTipoVehActivos || m.tipo_vehiculo === filtroTipoVehActivos;
      return matchQuery && matchNumSerie && matchTipoVeh;
    });
  }, [mantenimientos, queryActivos, filtroNumSerieActivos, filtroTipoVehActivos]);

  const filtradosHistorial = useMemo(() => {
    const q = queryHistorial.trim().toLowerCase();
    return mantenimientos.filter((m) => {
      const matchQuery = !q || m.num_serie.toLowerCase().includes(q) || m.matricula.toLowerCase().includes(q) || m.tipo_mantenimiento.toLowerCase().includes(q);
      const matchEstado = !filtroEstadoHist || m.estado_mantenimiento === filtroEstadoHist;
      const matchNumSerie = !filtroNumSerieHist || m.num_serie.toLowerCase().includes(filtroNumSerieHist.toLowerCase());
      const matchTipoVeh = !filtroTipoVehHist || m.tipo_vehiculo === filtroTipoVehHist;
      const matchTipoMant = !filtroTipoMantHist || m.tipo_mantenimiento === filtroTipoMantHist;
      const matchMarca = !filtroMarcaHist || m.marca === filtroMarcaHist;

      const fechaIngreso = m.fecha_ingreso_taller ? new Date(m.fecha_ingreso_taller) : null;
      const matchIngresoDesde = !filtroFechaIngresoDesde || (fechaIngreso && fechaIngreso >= new Date(filtroFechaIngresoDesde));
      const matchIngresoHasta = !filtroFechaIngresoHasta || (fechaIngreso && fechaIngreso <= new Date(filtroFechaIngresoHasta + "T23:59:59"));

      const fechaInicio = m.fecha_inicio_mantenimiento ? new Date(m.fecha_inicio_mantenimiento) : null;
      const matchInicioDesde = !filtroFechaInicioDesde || (fechaInicio && fechaInicio >= new Date(filtroFechaInicioDesde));
      const matchInicioHasta = !filtroFechaInicioHasta || (fechaInicio && fechaInicio <= new Date(filtroFechaInicioHasta + "T23:59:59"));

      const fechaFin = m.fecha_termino_mantenimiento ? new Date(m.fecha_termino_mantenimiento) : null;
      const matchFinDesde = !filtroFechaFinDesde || !fechaFin || (fechaFin >= new Date(filtroFechaFinDesde));
      const matchFinHasta = !filtroFechaFinHasta || !fechaFin || (fechaFin <= new Date(filtroFechaFinHasta + "T23:59:59"));

      const fechaSalida = m.fecha_egreso_taller ? new Date(m.fecha_egreso_taller) : null;
      const matchSalidaDesde = !filtroFechaSalidaDesde || !fechaSalida || (fechaSalida >= new Date(filtroFechaSalidaDesde));
      const matchSalidaHasta = !filtroFechaSalidaHasta || !fechaSalida || (fechaSalida <= new Date(filtroFechaSalidaHasta + "T23:59:59"));

      return matchQuery && matchEstado && matchNumSerie && matchTipoVeh && matchTipoMant && matchMarca &&
        matchIngresoDesde && matchIngresoHasta && matchInicioDesde && matchInicioHasta &&
        matchFinDesde && matchFinHasta && matchSalidaDesde && matchSalidaHasta;
    });
  }, [mantenimientos, queryHistorial, filtroEstadoHist, filtroNumSerieHist, filtroTipoVehHist, filtroTipoMantHist,
    filtroMarcaHist, filtroFechaIngresoDesde, filtroFechaIngresoHasta, filtroFechaInicioDesde, filtroFechaInicioHasta,
    filtroFechaFinDesde, filtroFechaFinHasta, filtroFechaSalidaDesde, filtroFechaSalidaHasta]);

  const filtrosActivosActivos = [filtroNumSerieActivos, filtroTipoVehActivos].filter(Boolean).length;
  const filtrosActivosHistorial = [filtroEstadoHist, filtroNumSerieHist, filtroTipoVehHist, filtroTipoMantHist,
    filtroMarcaHist, filtroFechaIngresoDesde, filtroFechaIngresoHasta,
    filtroFechaInicioDesde, filtroFechaInicioHasta, filtroFechaFinDesde,
    filtroFechaFinHasta, filtroFechaSalidaDesde, filtroFechaSalidaHasta].filter(Boolean).length;

  const limpiarFiltrosActivos = () => {
    setFiltroNumSerieActivos("");
    setFiltroTipoVehActivos("");
  };

  const limpiarFiltrosHistorial = () => {
    setFiltroEstadoHist("");
    setFiltroNumSerieHist("");
    setFiltroTipoVehHist("");
    setFiltroTipoMantHist("");
    setFiltroMarcaHist("");
    setFiltroFechaIngresoDesde("");
    setFiltroFechaIngresoHasta("");
    setFiltroFechaInicioDesde("");
    setFiltroFechaInicioHasta("");
    setFiltroFechaFinDesde("");
    setFiltroFechaFinHasta("");
    setFiltroFechaSalidaDesde("");
    setFiltroFechaSalidaHasta("");
  };

  function TablaMantenimientos({ filas, conAccionHistorial }: { filas: MantenimientoRow[]; conAccionHistorial: boolean }) {
    return (
      <div className={THEME.tableWrapper}>
        <table className={THEME.table}>
          <thead className={THEME.thead}>
            <tr>
              <th className={THEME.th}>Serie</th>
              <th className={THEME.th}>Matrícula</th>
              <th className={THEME.th}>Tipo mant.</th>
              <th className={THEME.th}>Marca</th>
              <th className={THEME.th}>Estado</th>
              <th className={THEME.th}>Entrada taller</th>
              <th className={THEME.th}>Salida taller</th>
              <th className={THEME.th}>Inicio mant.</th>
              <th className={THEME.th}>Término mant.</th>
              {conAccionHistorial && <th className={`${THEME.th} text-right`}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-t border-slate-100">
                <td colSpan={conAccionHistorial ? 10 : 9} className={`px-4 py-6 text-center text-sm ${THEME.muted} animate-pulse`}>
                  Buscando registros...
                </td>
              </tr>
            ) : filas.length === 0 ? (
              <tr className="border-t border-slate-100">
                <td colSpan={conAccionHistorial ? 10 : 9} className={`px-4 py-10 text-center text-sm ${THEME.muted}`}>
                  No se encontraron registros con esos criterios.
                </td>
              </tr>
            ) : (
              filas.map((item) => (
                <tr key={item.folio} className={THEME.trow}>
                  <td className={THEME.tcellMono}>{item.num_serie}</td>
                  <td className={THEME.tcell}>{item.matricula}</td>
                  <td className={THEME.tcell}>{item.tipo_mantenimiento}</td>
                  <td className={THEME.tcell}>{item.marca}</td>
                  <td className="px-4 py-3"><EstadoBadge estado={item.estado_mantenimiento} /></td>
                  <td className={THEME.tcell}>{formatDateTime(item.fecha_ingreso_taller)}</td>
                  <td className={THEME.tcell}>{formatDateTime(item.fecha_egreso_taller)}</td>
                  <td className={THEME.tcell}>{formatDateTime(item.fecha_inicio_mantenimiento)}</td>
                  <td className={THEME.tcell}>{formatDateTime(item.fecha_termino_mantenimiento)}</td>
                  {conAccionHistorial && (
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => verHistorial(item.num_serie)} className={THEME.btnGhost}>
                        Ver historial
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card title="En mantenimiento">
          <p className={`text-3xl font-bold ${THEME.heading}`}>{resumenLoading ? "..." : resumen.en_mantenimiento_total}</p>
        </Card>
        {resumen.por_tipo.map((item) => (
          <Card key={item.tipo_mantenimiento} title={item.tipo_mantenimiento}>
            <p className={`text-3xl font-bold ${THEME.heading}`}>{resumenLoading ? "..." : item.total}</p>
          </Card>
        ))}
      </div>

      <div className={`rounded-2xl ${THEME.surface} shadow-sm overflow-hidden`}>
        <div className="flex border-b border-slate-200">
          {(["activos", "historial"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-6 py-3 text-sm font-semibold transition-colors",
                tab === t
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : `${THEME.muted} hover:text-slate-600`,
              ].join(" ")}
            >
              {t === "activos" ? "Activos" : "Historial completo"}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4">
          {tab === "activos" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className={THEME.label}>Buscar mantenimiento activo</label>
                  <input
                    value={queryActivos}
                    onChange={(e) => setQueryActivos(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Número de serie, matrícula o tipo…"
                    className={`mt-1 w-full ${THEME.input}`}
                  />
                </div>
                <button onClick={handleSearch} className={THEME.btnPrimary}>Buscar</button>
                <button
                  onClick={() => setShowFiltersActivos((v) => !v)}
                  className={[THEME.btnSecondary, showFiltersActivos ? "ring-indigo-300 text-indigo-600" : ""].join(" ")}
                >
                  Filtros
                  {filtrosActivosActivos > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                      {filtrosActivosActivos}
                    </span>
                  )}
                </button>
              </div>

              {showFiltersActivos && (
                <div className={`rounded-xl ${THEME.inset} p-4`}>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className={THEME.label}>Número de serie</label>
                      <input
                        value={filtroNumSerieActivos}
                        onChange={(e) => setFiltroNumSerieActivos(e.target.value)}
                        placeholder="Buscar por serie..."
                        className={`mt-1 w-full ${THEME.input}`}
                      />
                    </div>
                    <div>
                      <label className={THEME.label}>Tipo de vehículo</label>
                      <select value={filtroTipoVehActivos} onChange={(e) => setFiltroTipoVehActivos(e.target.value)} className={`mt-1 w-full ${THEME.select}`}>
                        <option value="">Todos los tipos</option>
                        {tiposVehiculo.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  {filtrosActivosActivos > 0 && (
                    <button onClick={limpiarFiltrosActivos} className={`mt-3 text-xs ${THEME.body} underline underline-offset-2`}>
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}

              {error && <div className={THEME.errorBox}>{error}</div>}

              {!hasSearched
                ? <EmptyState mensaje="Busca para ver los mantenimientos activos" />
                : <TablaMantenimientos filas={filtradosActivos} conAccionHistorial={true} />
              }

              {hasSearched && !loading && mantenimientos.length > 0 && (
                <p className={`text-xs ${THEME.muted}`}>{filtradosActivos.length} registro(s) activo(s)</p>
              )}
            </>
          )}

          {tab === "historial" && (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className={THEME.label}>Buscar en el historial</label>
                  <input
                    value={queryHistorial}
                    onChange={(e) => setQueryHistorial(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Número de serie, matrícula o tipo…"
                    className={`mt-1 w-full ${THEME.input}`}
                  />
                </div>
                <button onClick={handleSearch} className={THEME.btnPrimary}>Buscar</button>
                <button
                  onClick={() => setShowFiltersHistorial((v) => !v)}
                  className={[THEME.btnSecondary, showFiltersHistorial ? "ring-indigo-300 text-indigo-600" : ""].join(" ")}
                >
                  Filtros
                  {filtrosActivosHistorial > 0 && (
                    <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                      {filtrosActivosHistorial}
                    </span>
                  )}
                </button>
              </div>

              {showFiltersHistorial && (
                <div className={`rounded-xl ${THEME.inset} p-4 space-y-4`}>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className={THEME.label}>Estado</label>
                      <select value={filtroEstadoHist} onChange={(e) => setFiltroEstadoHist(e.target.value)} className={`mt-1 w-full ${THEME.select}`}>
                        <option value="">Todos</option>
                        <option value="EN_MANTENIMIENTO">En mantenimiento</option>
                        <option value="FINALIZADO">Finalizado</option>
                      </select>
                    </div>
                    <div>
                      <label className={THEME.label}>Número de serie</label>
                      <input
                        value={filtroNumSerieHist}
                        onChange={(e) => setFiltroNumSerieHist(e.target.value)}
                        placeholder="Buscar por serie..."
                        className={`mt-1 w-full ${THEME.input}`}
                      />
                    </div>
                    <div>
                      <label className={THEME.label}>Tipo de vehículo</label>
                      <select value={filtroTipoVehHist} onChange={(e) => setFiltroTipoVehHist(e.target.value)} className={`mt-1 w-full ${THEME.select}`}>
                        <option value="">Todos los tipos</option>
                        {tiposVehiculo.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={THEME.label}>Tipo de mantenimiento</label>
                      <select value={filtroTipoMantHist} onChange={(e) => setFiltroTipoMantHist(e.target.value)} className={`mt-1 w-full ${THEME.select}`}>
                        <option value="">Todos</option>
                        {tiposMant.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={THEME.label}>Marca</label>
                      <select value={filtroMarcaHist} onChange={(e) => setFiltroMarcaHist(e.target.value)} className={`mt-1 w-full ${THEME.select}`}>
                        <option value="">Todas las marcas</option>
                        {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${THEME.heading} mb-3`}>Fecha de ingreso taller</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={THEME.label}>Desde</label>
                        <input type="date" value={filtroFechaIngresoDesde} onChange={(e) => setFiltroFechaIngresoDesde(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                      <div>
                        <label className={THEME.label}>Hasta</label>
                        <input type="date" value={filtroFechaIngresoHasta} onChange={(e) => setFiltroFechaIngresoHasta(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${THEME.heading} mb-3`}>Fecha de inicio mantenimiento</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={THEME.label}>Desde</label>
                        <input type="date" value={filtroFechaInicioDesde} onChange={(e) => setFiltroFechaInicioDesde(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                      <div>
                        <label className={THEME.label}>Hasta</label>
                        <input type="date" value={filtroFechaInicioHasta} onChange={(e) => setFiltroFechaInicioHasta(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${THEME.heading} mb-3`}>Fecha de término mantenimiento</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={THEME.label}>Desde</label>
                        <input type="date" value={filtroFechaFinDesde} onChange={(e) => setFiltroFechaFinDesde(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                      <div>
                        <label className={THEME.label}>Hasta</label>
                        <input type="date" value={filtroFechaFinHasta} onChange={(e) => setFiltroFechaFinHasta(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className={`text-sm font-semibold ${THEME.heading} mb-3`}>Fecha de salida taller</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={THEME.label}>Desde</label>
                        <input type="date" value={filtroFechaSalidaDesde} onChange={(e) => setFiltroFechaSalidaDesde(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                      <div>
                        <label className={THEME.label}>Hasta</label>
                        <input type="date" value={filtroFechaSalidaHasta} onChange={(e) => setFiltroFechaSalidaHasta(e.target.value)} className={`mt-1 w-full ${THEME.input}`} />
                      </div>
                    </div>
                  </div>

                  {filtrosActivosHistorial > 0 && (
                    <button onClick={limpiarFiltrosHistorial} className={`mt-3 text-xs ${THEME.body} underline underline-offset-2`}>
                      Limpiar todos los filtros
                    </button>
                  )}
                </div>
              )}

              {error && <div className={THEME.errorBox}>{error}</div>}

              {!hasSearched
                ? <EmptyState mensaje="Busca para ver el historial completo" />
                : <TablaMantenimientos filas={filtradosHistorial} conAccionHistorial={false} />
              }

              {hasSearched && !loading && mantenimientos.length > 0 && (
                <p className={`text-xs ${THEME.muted}`}>{filtradosHistorial.length} de {mantenimientos.length} registro(s)</p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}