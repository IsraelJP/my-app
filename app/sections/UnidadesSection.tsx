"use client";

import { useState, useEffect } from "react";

import {
  getVehiculos,
  getVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo
} from "../services/vehiculos";

import SearchBar from "../components/unidades/SearchBar";
import VehiculosTable from "../components/unidades/VehiculosTable";
import EmptyState from "../components/unidades/EmptyState";
import Toast from "../components/unidades/Toast";
import FiltrosVehiculos from "../components/unidades/FiltrosVehiculos";

import ModalDetalle from "../components/unidades/ModalDetalle";
import ModalCrear from "../components/unidades/ModalCrear";
import ModalEditar from "../components/unidades/ModalEditar";
import ModalEliminar from "../components/unidades/ModalEliminar";

import { API_BASE } from "./common";

export function UnidadesSection() {

  const [vehiculos,setVehiculos] = useState<any[]>([]);
  const [tipos,setTipos] = useState<any[]>([]);

  const [loading,setLoading] = useState(false);
  const [hasSearched,setHasSearched] = useState(false);

  const [query,setQuery] = useState("");

  const [toast,setToast] = useState<any>(null);

  const [offset,setOffset] = useState(0);
  const limit = 6;

  const [showFilters,setShowFilters] = useState(false);

  const [filtros,setFiltros] = useState({
    estatus:"",
    id_tipo:""
  });

  const showToast = (msg:string,type:"ok"|"err")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  // MODALS

  const [detalle,setDetalle] = useState<any>(null);
  const [detalleLoading,setDetalleLoading] = useState(false);
  const [detalleError,setDetalleError] = useState<any>(null);

  const [deleteTarget,setDeleteTarget] = useState<any>(null);
  const [deleteLoading,setDeleteLoading] = useState(false);
  const [deleteError,setDeleteError] = useState<any>(null);

  const [editTarget,setEditTarget] = useState<any>(null);
  const [editForm,setEditForm] = useState<any>({
    matricula:"",
    estatus:"ACTIVO",
    id_tipo:""
  });

  const [editLoading,setEditLoading] = useState(false);
  const [editError,setEditError] = useState<any>(null);

  const [showCreate,setShowCreate] = useState(false);

  const [createForm,setCreateForm] = useState<any>({
    num_serie:"",
    matricula:"",
    id_tipo:"",
    estatus:"ACTIVO"
  });

  const [createLoading,setCreateLoading] = useState(false);
  const [createError,setCreateError] = useState<any>(null);

  // CARGAR TIPOS

  useEffect(()=>{

    const fetchTipos = async()=>{

      try{

        const res = await fetch(`${API_BASE}/tipos`);
        const data = await res.json();

        if(Array.isArray(data)){
          setTipos(data);
        }else if(data.tipos){
          setTipos(data.tipos);
        }else{
          setTipos([]);
        }

      }catch(e){
        console.error("Error cargando tipos",e);
      }

    };

    fetchTipos();

  },[]);

  // FETCH VEHICULOS

  const fetchVehiculos = async(reset=false)=>{

    setLoading(true);

    try{

      const params:any = {
        offset: reset ? 0 : offset,
        limit
      };

      if(filtros.estatus) params.estatus = filtros.estatus;
      if(filtros.id_tipo) params.id_tipo = filtros.id_tipo;
      if(query) params.num_serie = query;

      const data = await getVehiculos(params);

      const lista = data?.vehiculos ?? [];

      if(reset){

        setVehiculos(lista);
        setOffset(limit);

      }else{

        setVehiculos(prev=>[...prev,...lista]);
        setOffset(prev=>prev+limit);

      }

    }catch(e:any){

      showToast(e.message,"err");

    }

    setLoading(false);

  };

  const handleSearch = ()=>{
    setHasSearched(true);
    fetchVehiculos(true);
  };

  // VER DETALLE

  const handleVer = async(numSerie:string)=>{

    setDetalleLoading(true);
    setDetalleError(null);

    try{

      const data = await getVehiculo(numSerie);
      console.log(data);
      setDetalle(data[0]);

    }catch(e:any){

      setDetalleError(e.message);

    }

    setDetalleLoading(false);

  };

  // CREAR

  const handleCreate = async()=>{

    setCreateLoading(true);
    setCreateError(null);

    try{

      await crearVehiculo(createForm);

      showToast("Vehículo creado","ok");

      setShowCreate(false);
      handleSearch();

    }catch(e:any){

      setCreateError(e.message);

    }

    setCreateLoading(false);

  };

  // EDITAR

  const handleEdit = async()=>{

    if(!editTarget) return;

    setEditLoading(true);
    setEditError(null);

    try{

      await actualizarVehiculo(editTarget.num_serie,editForm);

      showToast("Vehículo actualizado","ok");

      setEditTarget(null);
      handleSearch();

    }catch(e:any){

      setEditError(e.message);

    }

    setEditLoading(false);

  };

  // ELIMINAR

  const handleDelete = async()=>{

    if(!deleteTarget) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try{

      await eliminarVehiculo(deleteTarget.num_serie);

      showToast("Vehículo eliminado","ok");

      setDeleteTarget(null);
      handleSearch();

    }catch(e:any){

      setDeleteError(e.message);

    }

    setDeleteLoading(false);

  };

  return(

    <>

      <Toast toast={toast}/>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        filtrosActivos={Object.values(filtros).filter(v=>v).length}
        onToggleFilters={()=>setShowFilters(!showFilters)}
        onNuevo={()=>setShowCreate(true)}
      />

      {showFilters && (

        <FiltrosVehiculos
          filtros={filtros}
          setFiltros={setFiltros}
          tipos={tipos}
        />

      )}

      {!hasSearched
        ? <EmptyState/>
        : <VehiculosTable
            vehiculos={vehiculos}
            loading={loading}
            onVer={handleVer}
            onEdit={(v:any)=>{

              setEditTarget(v);

              setEditForm({
                matricula:v.matricula,
                estatus:v.estatus,
                id_tipo:v.id_tipo
              });

            }}
            onDelete={(v:any)=>setDeleteTarget(v)}
          />
      }

      {hasSearched && !loading && vehiculos.length >= limit && (

        <div style={{textAlign:"center",marginTop:"20px"}}>

          <button
            onClick={()=>fetchVehiculos(false)}
            style={{
              padding:"10px 18px",
              borderRadius:"8px",
              background:"#6c63ff",
              color:"white",
              border:"none",
              cursor:"pointer"
            }}
          >
            Mostrar siguientes
          </button>

        </div>

      )}

      <ModalDetalle
        detalle={detalle}
        loading={detalleLoading}
        error={detalleError}
        onClose={()=>setDetalle(null)}
      />

      <ModalEliminar
        target={deleteTarget}
        loading={deleteLoading}
        error={deleteError}
        onClose={()=>setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ModalCrear
        show={showCreate}
        form={createForm}
        setForm={setCreateForm}
        tipos={tipos}
        loading={createLoading}
        error={createError}
        onClose={()=>setShowCreate(false)}
        onSave={handleCreate}
      />

      <ModalEditar
        target={editTarget}
        form={editForm}
        setForm={setEditForm}
        tipos={tipos}
        loading={editLoading}
        error={editError}
        onClose={()=>setEditTarget(null)}
        onSave={handleEdit}
      />

    </>

  );

}