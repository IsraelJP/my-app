import { API_BASE } from "../sections/common";

export async function getVehiculos(params:any) {

  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_BASE}/vehiculoss/filtro?${query}`);

  if(!res.ok) throw new Error("Error obteniendo vehículos");

  return res.json();
}

export async function getVehiculo(numSerie:string){

  const res = await fetch(`${API_BASE}/vehiculos/${numSerie}`);

  if(!res.ok) throw new Error("Vehículo no encontrado");

  return res.json();
}

export async function crearVehiculo(data:any){

  const res = await fetch(`${API_BASE}/vehiculos`,{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  if(!res.ok) throw new Error("Error creando vehículo");

  return res.json();
}

export async function actualizarVehiculo(numSerie:string,data:any){

  const res = await fetch(`${API_BASE}/vehiculos/${numSerie}`,{
    method:"PATCH",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  });

  if(!res.ok) throw new Error("Error actualizando vehículo");

  return res.json();
}

export async function eliminarVehiculo(numSerie:string){

  const res = await fetch(`${API_BASE}/vehiculos/${numSerie}`,{
    method:"DELETE"
  });

  if(!res.ok) throw new Error("Error eliminando vehículo");

  return res.json();
}