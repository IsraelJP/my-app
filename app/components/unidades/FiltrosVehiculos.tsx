"use client";

export default function FiltrosVehiculos({
  filtros,
  setFiltros,
  tipos
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
      matricula: "",
      num_serie: "",
      id_vehiculo: ""
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
      <div style={{display:"flex",flexDirection:"column"}}>
        <label style={{fontSize:"13px",marginBottom:"4px"}}>
          Estatus
        </label>

        <select
          value={filtros.estatus || ""}
          onChange={(e)=>updateFiltro("estatus", e.target.value)}
          style={selectStyle}
        >
          <option value="">Todos</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
          <option value="MANTENIMIENTO">Mantenimiento</option>
        </select>
      </div>


      {/* TIPO */}
      <div style={{display:"flex",flexDirection:"column"}}>
        <label style={{fontSize:"13px",marginBottom:"4px"}}>
          Tipo vehículo
        </label>

        <select
          value={filtros.id_tipo || ""}
          onChange={(e)=>updateFiltro("id_tipo", e.target.value)}
          style={selectStyle}
        >
          <option value="">Todos</option>

          {tipos.map((t:any)=>(
            <option key={t.id_tipo} value={t.id_tipo}>
              {t.descripcion}
            </option>
          ))}
        </select>
      </div>


      {/* MATRICULA */}
      <div style={{display:"flex",flexDirection:"column"}}>
        <label style={{fontSize:"13px",marginBottom:"4px"}}>
          Matrícula
        </label>

        <input
          type="text"
          placeholder="Ej: ABC1234"
          value={filtros.matricula || ""}
          onChange={(e)=>updateFiltro("matricula", e.target.value)}
          style={inputStyle}
        />
      </div>


      {/* NUM SERIE */}
      <div style={{display:"flex",flexDirection:"column"}}>
        <label style={{fontSize:"13px",marginBottom:"4px"}}>
          Número de serie
        </label>

        <input
          type="text"
          placeholder="Buscar serie..."
          value={filtros.num_serie || ""}
          onChange={(e)=>updateFiltro("num_serie", e.target.value)}
          style={inputStyle}
        />
      </div>


      {/* ID VEHICULO */}
      <div style={{display:"flex",flexDirection:"column"}}>
        <label style={{fontSize:"13px",marginBottom:"4px"}}>
          ID vehículo
        </label>

        <input
          type="number"
          placeholder="ID"
          value={filtros.id_vehiculo || ""}
          onChange={(e)=>updateFiltro("id_vehiculo", e.target.value)}
          style={inputStyle}
        />
      </div>


      {/* LIMPIAR */}
      <button
        onClick={limpiarFiltros}
        style={{
          height:"38px",
          padding:"0 14px",
          borderRadius:"8px",
          border:"none",
          background:"#6366f1",
          color:"white",
          cursor:"pointer",
          fontWeight:"500"
        }}
      >
        Limpiar filtros
      </button>

    </div>
  );
}


const inputStyle = {
  height:"36px",
  padding:"6px 10px",
  borderRadius:"8px",
  border:"1px solid #d1d5db",
  outline:"none"
};

const selectStyle = {
  height:"36px",
  padding:"6px 10px",
  borderRadius:"8px",
  border:"1px solid #d1d5db",
  outline:"none"
};