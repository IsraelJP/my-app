"use client";

import { THEME } from "../../theme";

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  onToggleFilters,
  filtrosActivos,
  onNuevo
}: any) {

  return (
    <section className={`rounded-2xl ${THEME.surface} p-4 shadow-sm`}>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

        <div className="flex-1">
          <label className={THEME.label}>
            Buscar vehículo
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Número de serie o tipo de vehículo…"
            className={`mt-1 w-full ${THEME.input}`}
          />
        </div>

        <button
          onClick={onSearch}
          className={THEME.btnPrimary}
        >
          Buscar
        </button>

        <button
          onClick={onToggleFilters}
          className={THEME.btnSecondary}
        >
          Filtros

          {filtrosActivos > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
              {filtrosActivos}
            </span>
          )}
        </button>

        <button
          onClick={onNuevo}
          className={THEME.btnSecondary}
        >
          + Nuevo
        </button>

      </div>
    </section>
  );
}