import type { ReactNode } from "react";
import { THEME } from "../theme";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface Vehiculo {
  num_serie: string;
  tipo?: string;
  descripcion?: string;
  estatus: "ACTIVO" | "INACTIVO" | "MANTENIMIENTO" | string;
}

export interface VehiculoDetalle {
  id_vehiculo: number;
  num_serie: string;
  matricula: string;
  id_tipo?: number;
  descripcion: string;
  estatus: string;
  en_mantenimiento: "SI" | "NO";
  tipo_mantenimiento?: string | null;
  fecha_ingreso_taller?: string | null;
  fecha_egreso_taller?: string | null;
  fecha_inicio_mantenimiento?: string | null;
  fecha_termino_mantenimiento?: string | null;
}

export interface TipoVehiculo {
  id_tipo: number;
  descripcion: string;
}

export interface Tipo {
  id_tipo: number;
  descripcion: string;
}

export interface MantenimientoRow {
  folio: number;
  num_serie: string;
  matricula: string;
  marca: string
  tipo_vehiculo: string;
  tipo_mantenimiento: string;
  fecha_ingreso_taller: string | null;
  fecha_egreso_taller: string | null;
  fecha_inicio_mantenimiento: string | null;
  fecha_termino_mantenimiento: string | null;
  fecha_salida_programada: string | null;
  estado_mantenimiento: "EN_MANTENIMIENTO" | "FINALIZADO" | string;
}

export interface ResumenMantenimientos {
  en_mantenimiento_total: number;
  por_tipo: { tipo_mantenimiento: string; total: number }[];
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl ${THEME.surface} p-4 shadow-sm`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${THEME.heading}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <div className={THEME.kpiCard}>
      <p className={THEME.kpiLabel}>{label}</p>
      <div className={THEME.kpiValue}>
        {loading ? <div className={THEME.kpiSkeleton} /> : value ?? 0}
      </div>
    </div>
  );
}
