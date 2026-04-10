"use client";

import { THEME } from "../../theme";

function estatusBadge(estatus: string) {
  if (estatus === "ACTIVO") return THEME.badgeActivo;
  if (estatus === "MANTENIMIENTO") return THEME.badgeMantenimiento;
  return THEME.badgeInactivo;
}

export default function VehiculosTable({
  vehiculos,
  marcas,
  loading,
  onVer,
  onEdit,
  onDelete
}: any) {

  return (
    <div className={THEME.tableWrapper}>
      <table className={THEME.table}>

        <thead className={THEME.thead}>
          <tr>
            <th className={`${THEME.th} w-48`}>Número de serie</th>
            <th className={`${THEME.th} w-52`}>Tipo</th>
            <th className={`${THEME.th} w-40`}>Marca</th>
            <th className={`${THEME.th} w-36`}>Estatus</th>
            <th className={`${THEME.th} text-right`}>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {loading && (
            <tr>
              <td colSpan={5} className={`px-4 py-6 text-center text-sm ${THEME.muted}`}>
                Buscando vehículos…
              </td>
            </tr>
          )}

          {!loading && vehiculos.length === 0 && (
            <tr>
              <td colSpan={5} className={`px-4 py-10 text-center text-sm ${THEME.muted}`}>
                No se encontraron vehículos
              </td>
            </tr>
          )}

          {!loading && vehiculos.map((v: any) => {

            const marcaNombre =
              marcas?.find((m: any) => m.id_marca === v.id_marca)?.nombre ?? "—";

            return (
              <tr key={v.num_serie} className={THEME.trow}>

                {/* Número de serie */}
                <td className={THEME.tcellMono}>
                  {v.num_serie}
                </td>

                {/* Tipo */}
                <td className={THEME.tcell}>
                  {v.descripcion ?? v.tipo ?? "—"}
                </td>

                {/* Marca */}
                <td className={THEME.tcell}>
                  {marcaNombre}
                </td>

                {/* Estatus */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${estatusBadge(v.estatus)}`}>
                    {v.estatus}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-4 py-3 text-right">

                  <div className="inline-flex gap-2">

                    <button
                      onClick={() => onVer(v.num_serie)}
                      className={THEME.btnGhost}
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => onEdit(v)}
                      className={THEME.btnEdit}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onDelete(v)}
                      className={THEME.btnDelete}
                    >
                      Eliminar
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>
      </table>
    </div>
  );
}