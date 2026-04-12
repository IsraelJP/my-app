"use client";

import { THEME } from "../../theme";

export default function ModalFinalizarMantenimiento({
  show,
  mantenimiento,   // { folio, num_serie, matricula, tipo_mantenimiento }
  form,
  setForm,
  loading,
  error,
  onClose,
  onSave,
}: any) {
  if (!show || !mantenimiento) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className={`text-lg font-bold ${THEME.heading}`}>
              Finalizar mantenimiento
            </h2>
            <p className={`mt-0.5 ${THEME.mono}`}>
              {mantenimiento.num_serie} — Folio #{mantenimiento.folio}
            </p>
          </div>
          <button onClick={onClose} className={THEME.btnGhost}>
            Cerrar ✕
          </button>
        </div>

        {/* Info del mantenimiento */}
        <div className={`rounded-xl ${THEME.inset} px-4 py-3 mb-5`}>
          <p className={`text-xs ${THEME.muted} mb-1`}>Tipo de mantenimiento</p>
          <p className={`text-sm font-semibold ${THEME.heading}`}>
            {mantenimiento.tipo_mantenimiento}
          </p>
        </div>

        <div className="space-y-4">

          {/* Fecha término mantenimiento */}
          <div>
            <label className={THEME.label}>
              Fecha término mantenimiento *
            </label>
            <input
              type="date"
              value={form.fecha_termino_mantenimiento}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  fecha_termino_mantenimiento: e.target.value,
                }))
              }
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>

          {/* Fecha egreso taller */}
          <div>
            <label className={THEME.label}>
              Fecha egreso de taller *
            </label>
            <input
              type="date"
              value={form.fecha_egreso_taller}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  fecha_egreso_taller: e.target.value,
                }))
              }
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>

          {error && (
            <div className={THEME.errorBox}>{error}</div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className={THEME.btnSecondary}>
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className={THEME.btnPrimary}
            >
              {loading ? "Guardando…" : "Finalizar mantenimiento"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}