"use client";

import { THEME } from "../../theme";

export default function ModalEditar({
  target,
  form,
  setForm,
  tipos,
  loading,
  error,
  onClose,
  onSave
}: any) {

  if (!target) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6`}>

        <div className="flex items-start justify-between gap-4 mb-5">

          <div>
            <h2 className={`text-lg font-bold ${THEME.heading}`}>
              Editar vehículo
            </h2>

            <p className={`mt-0.5 ${THEME.mono}`}>
              {target.num_serie}
            </p>
          </div>

          <button
            onClick={onClose}
            className={THEME.btnGhost}
          >
            Cerrar ✕
          </button>

        </div>

        <div className="space-y-4">

          <div>
            <label className={THEME.label}>
              Matrícula
            </label>

            <input
              value={form.matricula}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, matricula: e.target.value }))
              }
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>

          <div>
            <label className={THEME.label}>
              Estatus
            </label>

            <select
              value={form.estatus}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, estatus: e.target.value }))
              }
              className={`mt-1 w-full ${THEME.select}`}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div>
            <label className={THEME.label}>
              Tipo de vehículo
            </label>

            <select
              value={form.id_tipo}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, id_tipo: e.target.value }))
              }
              className={`mt-1 w-full ${THEME.select}`}
            >
              <option value="">— Selecciona tipo —</option>

              {tipos.map((t: any) => (
                <option key={t.id_tipo} value={t.id_tipo}>
                  {t.descripcion}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className={THEME.errorBox}>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">

            <button
              onClick={onClose}
              className={THEME.btnSecondary}
            >
              Cancelar
            </button>

            <button
              onClick={onSave}
              disabled={loading}
              className={THEME.btnPrimary}
            >
              {loading ? "Guardando…" : "Guardar cambios"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}