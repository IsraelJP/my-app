"use client";

import { THEME } from "../../theme";

export default function EmptyState() {
  return (
    <div className={`rounded-2xl ${THEME.surface} p-12 shadow-sm flex flex-col items-center gap-4 text-center`}>
      <div className={`grid h-16 w-16 place-items-center rounded-2xl ${THEME.logo} text-3xl`}>
        🚌
      </div>

      <div>
        <p className={`text-base font-semibold ${THEME.heading}`}>
          Busca un vehículo para comenzar
        </p>

        <p className={`mt-1 text-sm ${THEME.body}`}>
          Ingresa un número de serie, matrícula o tipo en el campo de búsqueda.
        </p>
      </div>
    </div>
  );
}