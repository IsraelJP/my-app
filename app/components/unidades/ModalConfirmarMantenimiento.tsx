"use client";

import { THEME } from "../../theme";

export default function ModalConfirmarMantenimiento({
  show,
  numSerie,
  onConfirm,
  onCancel
}: any) {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>
        <div className="mb-4">
          <h2 className={`text-lg font-bold ${THEME.heading}`}>
            Vehiculo creado correctamente
          </h2>
          <p className={`mt-2 text-sm ${THEME.body}`}>
            Se creo el vehiculo con numero de serie {numSerie}. Deseas iniciar mantenimiento ahora?
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className={THEME.btnSecondary}>
            No, finalizar
          </button>
          <button onClick={onConfirm} className={THEME.btnPrimary}>
            Si, iniciar mantenimiento
          </button>
        </div>
      </div>
    </div>
  );
}
