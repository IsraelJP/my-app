"use client";

export default function FiltrosMantenimientos({
    show,
    filtros,
    setFiltros,
    tiposMantenimiento
}: any) {

    if (!show) return null;

    function update(key: string, value: any) {
        setFiltros({
            ...filtros,
            [key]: value
        });
    }

    return (
        <div className="mb-5 space-y-6">

            {/* FILA */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 mb-1">Folio</span>
                    <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        placeholder="Ej: 1023"
                        value={filtros.folio}
                        onChange={(e) => update("folio", e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 mb-1">Tipo mantenimiento</span>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={filtros.id_tipo_mantenimiento}
                        onChange={(e) => update("id_tipo_mantenimiento", e.target.value)}
                    >
                        <option value="">Todos</option>
                        {tiposMantenimiento?.map((t: any) => (
                            <option
                                key={t.id_tipo_mantenimiento}
                                value={t.id_tipo_mantenimiento}
                            >
                                {t.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 mb-1">Estado</span>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={filtros.estado}
                        onChange={(e) => update("estado", e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="EN_PROCESO">En proceso</option>
                        <option value="FINALIZADO">Finalizado</option>
                    </select>
                </div>

                {/* ORDEN */}
                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 mb-1">Orden</span>
                    <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={filtros.orden}
                        onChange={(e) => update("orden", e.target.value)}
                    >
                        <option value="desc">Más recientes</option>
                        <option value="asc">Más antiguos</option>
                    </select>
                </div>

            </div>

            {/* FECHAS */}
            <div>
                <div className="text-xs text-gray-500 mb-3 font-medium">
                    Filtros por fechas
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

                    <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 mb-1">Ingreso</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={filtros.fecha_ingreso}
                            onChange={(e) => update("fecha_ingreso", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 mb-1">Inicio</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={filtros.fecha_inicio}
                            onChange={(e) => update("fecha_inicio", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 mb-1">Egreso</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={filtros.fecha_egreso}
                            onChange={(e) => update("fecha_egreso", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 mb-1">Término</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm"
                            value={filtros.fecha_termino}
                            onChange={(e) => update("fecha_termino", e.target.value)}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}