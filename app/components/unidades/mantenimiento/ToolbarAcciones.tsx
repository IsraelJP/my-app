"use client";

export default function ToolbarAcciones({
    setShowBuscarVehiculo,
    showFilters,
    setShowFilters,
    limpiarFiltros
}: any) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">

            <button
                onClick={() => setShowBuscarVehiculo(true)}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
            >
                Cambiar vehículo
            </button>

            <button
                onClick={() => setShowFilters((prev: boolean) => !prev)} 
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
            >
                {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </button>

            <button
                onClick={limpiarFiltros}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100"
            >
                Limpiar filtros
            </button>

        </div>
    );
}