"use client";

export default function HeaderVehiculo({ vehiculo, onClose }: any) {
  return (
    <div className="flex justify-between items-start mb-5">

      <div className="space-y-2">

        <h2 className="text-2xl font-bold text-gray-900">
          Historial de mantenimientos
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-sm">

          <div className="flex items-center gap-1">
            <span className="text-gray-500">Serie:</span>
            <span className="font-semibold text-gray-900">
              {vehiculo?.num_serie}
            </span>
          </div>

          <span className="text-gray-300">|</span>

          <div className="flex items-center gap-1">
            <span className="text-gray-500">Placa:</span>
            <span className="font-semibold text-gray-900">
              {vehiculo?.matricula}
            </span>
          </div>

        </div>

      </div>

      <button
        onClick={onClose}
        className="px-3 py-1.5 border rounded-lg text-sm text-gray-700 hover:bg-gray-100"
      >
        Cerrar ✕
      </button>

    </div>
  );
}