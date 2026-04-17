"use client";

import { THEME } from "../../theme";
import { formatDateTime } from "../../sections/common";

function estatusBadge(estatus: string) {
  if (estatus === "ACTIVO") return THEME.badgeActivo;
  if (estatus === "MANTENIMIENTO") return THEME.badgeMantenimiento;
  return THEME.badgeInactivo;
}

export default function ModalDetalle({
  detalle,
  loading,
  error,
  onClose,
  onViewHistory
}: any) {

  if (!detalle && !loading && !error) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${THEME.overlay} px-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-md rounded-2xl ${THEME.surface} shadow-2xl p-6 pb-20`}>

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className={`text-lg font-bold ${THEME.heading}`}>
              Detalle del vehículo
            </h2>

            {detalle && (
              <p className={`mt-0.5 ${THEME.mono}`}>
                {detalle.num_serie}
              </p>
            )}
          </div>

          <button onClick={onClose} className={THEME.btnGhost}>
            Cerrar ✕
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={THEME.skeleton} />
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className={THEME.errorBox}>
            {error}
          </div>
        )}

        {/* DETALLE */}
        {detalle && !loading && (
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">

            {[
              { label: "ID", value: detalle.id_vehiculo },
              { label: "Número de serie", value: detalle.num_serie },
              { label: "Matrícula", value: detalle.matricula },
              { label: "Marca", value: detalle.marca ?? detalle.nombre_marca ?? "—" },
              { label: "Tipo", value: detalle.descripcion },
              { label: "Estatus", value: detalle.estatus, badge: true },
              { label: "En mantenimiento", value: detalle.en_mantenimiento },
              { label: "Tipo mantenimiento", value: detalle.tipo_mantenimiento ?? "—" },
              { label: "Ingreso a taller", value: formatDateTime(detalle.fecha_ingreso_taller) },
              { label: "Inicio mantenimiento", value: formatDateTime(detalle.fecha_inicio_mantenimiento) },
              { label: "Término mantenimiento", value: formatDateTime(detalle.fecha_termino_mantenimiento) },
              { label: "Egreso de taller", value: formatDateTime(detalle.fecha_egreso_taller) },
            ].map(({ label, value, badge }) => (

              <div key={label} className={`rounded-xl ${THEME.inset} px-3 py-2`}>
                <dt className={THEME.label}>{label}</dt>

                <dd className={`mt-0.5 text-sm font-medium ${THEME.heading}`}>
                  {badge ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${estatusBadge(String(value))}`}
                    >
                      {value}
                    </span>
                  ) : (
                    String(value ?? "—")
                  )}
                </dd>
              </div>

            ))}
          </dl>
        )}

        {/* FOOTER */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 flex gap-3 ${THEME.surface} border-t`}>
          
          <button
            onClick={onClose}
            className={`flex-1 ${THEME.btnGhost}`}
          >
            Cerrar
          </button>

          <button
            onClick={() => onViewHistory?.(detalle)}
            className={`flex-1 ${THEME.btnPrimary}`}
          >
            Ver historial
          </button>

        </div>

      </div>
    </div>
  );
}