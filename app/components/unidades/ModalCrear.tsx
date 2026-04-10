"use client";

import { THEME } from "../../theme";

export default function ModalCrear({
  show,
  form,
  setForm,
  tipos,
  marcas,      // ✅ AÑADIDO: recibe el array de marcas
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
            Nuevo vehículo
          </h2>

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
              Número de serie *
            </label>

            <input
              value={form.num_serie}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, num_serie: e.target.value }))
              }
              className={`mt-1 w-full ${THEME.input}`}
            />
          </div>

          <div>
            <label className={THEME.label}>
              Matrícula *
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
              Tipo de vehículo *
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


          <div>
            <label className={THEME.label}>
              Marca *
            </label>

            <select
              value={form.id_marca}
              onChange={(e) =>
                setForm((f: any) => ({ ...f, id_marca: e.target.value }))
              }
              className={`mt-1 w-full ${THEME.select}`}
            >
              <option value="">— Selecciona marca —</option>

              {marcas?.map((m: any) => (
                <option key={m.id_marca} value={m.id_marca}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={THEME.label}>
              Estatus inicial
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
              <option value="MANTENIMIENTO">MANTENIMIENTO</option>
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
              {loading ? "Creando…" : "Crear vehículo"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}