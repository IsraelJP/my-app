"use client";

import { THEME } from "../../theme";

export default function ModalCrearMantenimiento({
  show,
  form,
  setForm,
  tiposMantenimiento,
  loading,
  error,
  onClose,
  onSave
}: any) {

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>

        <div className="flex items-start justify-between gap-4 mb-5">
          <h2 className={`text-lg font-bold ${THEME.heading}`}>
            Nuevo mantenimiento
          </h2>

          <button onClick={onClose} className={THEME.btnGhost}>
            Cerrar ✕
          </button>
        </div>

        <div className="space-y-4">

          {/* Tipo mantenimiento */}
          <div>
            <label className={THEME.label}>
              Tipo de mantenimiento *
            </label>

            <select
              value={form.id_tipo_mantenimiento}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  id_tipo_mantenimiento: Number(e.target.value)
                }))
              }
              className={`mt-1 w-full ${THEME.select}`}
            >
              <option value="">— Selecciona tipo —</option>

              {tiposMantenimiento.map((t: any) => (
                <option key={t.id_tipo_mantenimiento} value={t.id_tipo_mantenimiento}>
                  {t.nombre} - {t.descripcion}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className={THEME.label}>
              Fecha inicio *
            </label>

            <input
              type="date"
              value={form.fecha_inicio_mantenimiento}
              onChange={(e) =>
                setForm((f: any) => ({
                  ...f,
                  fecha_inicio_mantenimiento: e.target.value
                }))
              }
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>

          {error && (
            <div className={THEME.errorBox}>
              {error}
            </div>
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
              {loading ? "Guardando…" : "Iniciar mantenimiento"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}