"use client";

import { useMemo, useState } from "react";
import { ConfigSection } from "./sections/ConfigSection";
import { DashboardSection } from "./sections/DashboardSection";
import { TiposMantenimientoSection } from "./sections/TiposMantenimientoSection";
import { TiposSection } from "./sections/TiposSection";
import { UnidadesSection } from "./sections/UnidadesSection";

type NavKey = "dashboard" | "unidades" | "tipos" | "tipos_mant" | "config";

const NAV: { key: NavKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "unidades", label: "Vehiculos" },
  { key: "tipos", label: "Tipos" },
  { key: "tipos_mant", label: "Mantenimientos" },
  { key: "config", label: "Config" },
];

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
        return { h1: "Mantenimientos", p: "Estado, fechas y conteo por tipo" };
      case "config":
        return { h1: "Configuración", p: "Ajustes del panel y entorno" };
    }
  }, [active]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
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
                  active === item.key ? "bg-white/10 font-semibold" : "text-white/70 hover:bg-white/10",
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

        <main className="flex-1 space-y-4">
          <header className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{title.h1}</h1>
              <p className="mt-1 text-sm text-white/60">{title.p}</p>
            </div>
            <div className="flex flex-wrap gap-2" />
          </header>

          {active === "dashboard" && <DashboardSection />}
          {active === "unidades" && <UnidadesSection />}
          {active === "tipos" && <TiposSection />}
          {active === "tipos_mant" && <TiposMantenimientoSection />}
          {active === "config" && <ConfigSection />}

          <footer className="text-xs text-white/45" />
        </main>
      </div>
    </div>
  );
}
