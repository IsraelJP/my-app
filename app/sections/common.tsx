import type { ReactNode } from "react";

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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
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
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <div className="mt-2 text-2xl font-bold">
        {loading ? <div className="h-7 w-16 animate-pulse rounded-lg bg-white/10" /> : value ?? 0}
      </div>
    </div>
  );
}
