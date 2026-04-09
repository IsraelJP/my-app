"use client";

import { THEME } from "../../theme";

export default function ModalEliminar({
  target,
  loading,
  error,
  onClose,
  onConfirm
}: any) {

  if (!target) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-sm rounded-2xl ${THEME.surface} shadow-2xl p-6`}>

        <h2 className={`text-lg font-bold ${THEME.heading}`}>
          ¿Eliminar vehículo?
        </h2>

        <p className={`mt-2 text-sm ${THEME.body}`}>
          Esta acción no se puede deshacer. Se eliminará:
        </p>

        <p className="mt-2 font-mono text-sm font-semibold text-rose-600">
          {target.num_serie}
        </p>

        {error && (
          <div className={`mt-3 ${THEME.errorBox}`}>
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">

          <button
            onClick={onClose}
            className={THEME.btnSecondary}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={THEME.btnDanger}
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </button>

        </div>

      </div>
    </div>
  );
}