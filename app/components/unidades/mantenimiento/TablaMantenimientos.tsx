"use client";

export default function TablaMantenimientos({
  loading,
  mantenimientos
}: any) {
  return (
    <div className="overflow-auto border rounded-lg">

      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Folio</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Ingreso</th>
            <th className="p-2">Inicio</th>
            <th className="p-2">Egreso</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>

        <tbody>

          {loading && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-400">
                Cargando...
              </td>
            </tr>
          )}

          {!loading && mantenimientos.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-6 text-gray-400">
                Sin registros
              </td>
            </tr>
          )}

          {!loading && mantenimientos.map((m: any) => (
            <tr key={m.folio} className="border-t hover:bg-gray-50">

              <td className="p-2 font-mono">{m.folio}</td>
              <td className="p-2">{m.tipo_mantenimiento}</td>
              <td className="p-2">{m.fecha_ingreso_taller}</td>
              <td className="p-2">{m.fecha_inicio_mantenimiento}</td>
              <td className="p-2">{m.fecha_egreso_taller ?? "—"}</td>
              <td className="p-2">{m.estado}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}