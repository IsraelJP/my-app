"use client";

import { useState } from "react";
import { THEME } from "./theme";
import { DashboardSection } from "./sections/DashboardSection";
import { TiposMantenimientoSection } from "./sections/TiposMantenimientoSection";
import { UnidadesSection } from "./sections/UnidadesSection";

type NavKey = "dashboard" | "unidades" | "tipos_mant";

const NAV: { key: NavKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "unidades", label: "Vehiculos" },
  { key: "tipos_mant", label: "Mantenimientos" },
];

export default function Home() {
  const [active, setActive] = useState<NavKey>("dashboard");


  return (
    <div className={`min-h-screen ${THEME.page}`}>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">

        {/* Sidebar */}
        <aside className={`hidden w-64 shrink-0 rounded-2xl ${THEME.surface} p-4 shadow-sm md:block`}>
          <div className="flex items-center gap-3">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${THEME.logo}`}>
              <span className="text-sm font-bold">UV</span>
            </div>
            <div>
              <p className={`text-sm font-semibold ${THEME.heading}`}>Panel</p>
              <p className={`text-xs ${THEME.muted}`}>Control de Vehiculos</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                  active === item.key ? THEME.navActive : THEME.navInactive,
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className={`mt-6 rounded-xl ${THEME.inset} p-3 text-xs ${THEME.muted}`}>
            Panel de control de flota vehicular.
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 space-y-4">
          <header className={`flex flex-col gap-3 rounded-2xl ${THEME.surface} p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between`}>
            <div>
              <h1 className={`text-2xl font-bold ${THEME.heading}`}>  </h1>
            </div>
            <div className="flex flex-wrap gap-2" />
          </header>

          {active === "dashboard"  && <DashboardSection />}
          {active === "unidades"   && <UnidadesSection />}
        
          {active === "tipos_mant" && <TiposMantenimientoSection />}

          <footer className={`text-xs ${THEME.muted}`} />
        </main>
      </div>
    </div>
  );
}
