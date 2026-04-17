"use client";

export default function FiltrosVehiculos({
    filtros,
    setFiltros,
    tipos,
    marcas
}: any) {

    function updateFiltro(key: string, value: any) {
        setFiltros({
            ...filtros,
            [key]: value
        });
    }

    function limpiarFiltros() {
        setFiltros({
            estatus: "",
            id_tipo: "",
            id_marca: "",
            orden: "desc"
        });
    }

    return (
        <div
            style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#f8f9fb",
                border: "1px solid #e5e7eb",
                marginBottom: "25px",
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "flex-end"
            }}
        >

            {/* ESTATUS */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", marginBottom: "4px" }}>
                    Estatus
                </label>

                <select
                    value={filtros.estatus || ""}
                    onChange={(e) => updateFiltro("estatus", e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Todos</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                </select>
            </div>


            {/* TIPO */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", marginBottom: "4px" }}>
                    Tipo vehículo
                </label>

                <select
                    value={filtros.id_tipo || ""}
                    onChange={(e) => updateFiltro("id_tipo", e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Todos</option>

                    {tipos.map((t: any) => (
                        <option key={t.id_tipo} value={t.id_tipo}>
                            {t.descripcion}
                        </option>
                    ))}
                </select>
            </div>


            {/* MARCA*/}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", marginBottom: "4px" }}>
                    Marca
                </label>

                <select
                    value={filtros.id_marca || ""}
                    onChange={(e) => updateFiltro("id_marca", e.target.value)}
                    style={selectStyle}
                >
                    <option value="">Todas</option>

                    {marcas?.map((m: any) => (
                        <option key={m.id_marca} value={m.id_marca}>
                            {m.nombre}
                        </option>
                    ))}
                </select>
            </div>


            {/* ORDEN */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", marginBottom: "4px" }}>
                    Orden
                </label>

                <select
                    value={filtros.orden}
                    onChange={(e) => updateFiltro("orden", e.target.value)}
                    style={selectStyle}
                >
                    <option value="desc">Más recientes</option>
                    <option value="asc">Más antiguos</option>
                </select>
            </div>


            {/* LIMPIAR */}
            <button
                onClick={limpiarFiltros}
                style={{
                    height: "38px",
                    padding: "0 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#6366f1",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "500"
                }}
            >
                Limpiar filtros
            </button>

        </div>
    );
}

const selectStyle = {
    height: "36px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none"
};