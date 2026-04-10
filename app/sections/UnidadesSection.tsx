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
import Toast from "../components/unidades/Toast";
import FiltrosVehiculos from "../components/unidades/FiltrosVehiculos";
import { getHistorialMantenimientos } from "../services/mantenimientos";

import ModalDetalle from "../components/unidades/ModalDetalle";
import ModalCrear from "../components/unidades/ModalCrear";
import ModalEditar from "../components/unidades/ModalEditar";
import ModalEliminar from "../components/unidades/ModalEliminar";
import { getMarcas } from "../services/marcas";
import ModalHistorialMantenimientos from "../components/unidades/ModalHistorialMantenimientos";

import { API_BASE } from "./common";

export function UnidadesSection() {

  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [tipos, setTipos] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistorial, setShowHistorial] = useState(false);
  const [vehiculoHistorial, setVehiculoHistorial] = useState<any>(null);
  const [query, setQuery] = useState("");

  const [toast, setToast] = useState<any>(null);

  const [offset, setOffset] = useState(0);
  const limit = 6;

  const [showFilters, setShowFilters] = useState(false);

  const [filtros, setFiltros] = useState({
    estatus: "",
    id_tipo: "",
    id_marca: "",
    orden: "desc"
  });

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchHistorial = async (numSerie: string, filtros: any) => {
    return await getHistorialMantenimientos(numSerie, filtros);
  };

  // MODALS

  const [detalle, setDetalle] = useState<any>(null);
  const [detalleLoading, setDetalleLoading] = useState(false);
  const [detalleError, setDetalleError] = useState<any>(null);

  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<any>(null);

  const [editTarget, setEditTarget] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({
    matricula: "",
    estatus: "ACTIVO",
    id_tipo: "",
    id_marca: ""  // ✅ AÑADIDO
  });

  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<any>(null);

  const [showCreate, setShowCreate] = useState(false);

  // ✅ CORREGIDO: id_marca agregado al estado inicial del form
  const [createForm, setCreateForm] = useState<any>({
    num_serie: "",
    matricula: "",
    id_tipo: "",
    id_marca: "",  // ✅ AÑADIDO
    estatus: "ACTIVO"
  });

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<any>(null);

  // CARGAR TIPOS & MARCAS

  useEffect(() => {

    const fetchData = async () => {

      try {

        const resTipos = await fetch(`${API_BASE}/tipos`);
        const dataTipos = await resTipos.json();

        if (Array.isArray(dataTipos)) {
          setTipos(dataTipos);
        } else if (dataTipos.tipos) {
          setTipos(dataTipos.tipos);
        } else {
          setTipos([]);
        }

        const dataMarcas = await getMarcas();

        const listaMarcas = Array.isArray(dataMarcas)
          ? dataMarcas
          : dataMarcas.marcas ?? [];

        setMarcas(listaMarcas);

      } catch (e) {
        console.error("Error cargando datos", e);
      }

    };

    fetchData();

  }, []);

  // FETCH VEHICULOS

  const fetchVehiculos = async (offsetValue: number) => {

    setLoading(true);

    try {

      const params: any = {
        offset: offsetValue,
        limit
      };

      if (filtros.estatus) params.estatus = filtros.estatus;
      if (filtros.id_tipo) params.id_tipo = filtros.id_tipo;
      if (filtros.id_marca) params.id_marca = filtros.id_marca;
      if (query) params.query = query;

      params.orden = filtros.orden;

      const data = await getVehiculos(params);

      const lista = data?.vehiculos ?? [];

      setVehiculos(lista);
      setOffset(offsetValue);

    } catch (e: any) {

      showToast(e.message, "err");

    }

    setLoading(false);

  };

  // CARGA INICIAL

  useEffect(() => {
    fetchVehiculos(0);
  }, []);

  // BUSQUEDA AUTOMATICA

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchVehiculos(0);
    }, 500);

    return () => clearTimeout(delay);

  }, [query]);

  // FILTROS AUTOMATICOS

  useEffect(() => {
    setOffset(0);
    fetchVehiculos(0);
  }, [filtros]);

  const handleNext = () => {
    fetchVehiculos(offset + limit);
  };

  const handlePrev = () => {
    if (offset === 0) return;
    fetchVehiculos(offset - limit);
  };

  const handleVerHistorial = (vehiculo: any) => {
    setVehiculoHistorial(vehiculo);
    setShowHistorial(true);
  };

  // VER DETALLE

  const handleVer = async (numSerie: string) => {

    setDetalleLoading(true);
    setDetalleError(null);

    try {

      const data = await getVehiculo(numSerie);

      if (Array.isArray(data)) {
        setDetalle(data[0]);
      } else {
        setDetalle(data);
      }

    } catch (e: any) {
      setDetalleError(e.message);
    }

    setDetalleLoading(false);

  };

  // CREAR

  const handleCreate = async () => {

    setCreateLoading(true);
    setCreateError(null);

    try {

      await crearVehiculo(createForm);

      showToast("Vehículo creado", "ok");

      setShowCreate(false);

      // ✅ Resetear form incluyendo id_marca
      setCreateForm({
        num_serie: "",
        matricula: "",
        id_tipo: "",
        id_marca: "",
        estatus: "ACTIVO"
      });

      fetchVehiculos(0);

    } catch (e: any) {
      setCreateError(e.message);
    }

    setCreateLoading(false);

  };

  // EDITAR

  const handleEdit = async () => {

    if (!editTarget) return;

    setEditLoading(true);
    setEditError(null);

    try {

      await actualizarVehiculo(editTarget.num_serie, editForm);

      showToast("Vehículo actualizado", "ok");

      setEditTarget(null);
      fetchVehiculos(offset);

    } catch (e: any) {
      setEditError(e.message);
    }

    setEditLoading(false);

  };

  // ELIMINAR

  const handleDelete = async () => {

    if (!deleteTarget) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {

      await eliminarVehiculo(deleteTarget.num_serie);

      showToast("Vehículo eliminado", "ok");

      setDeleteTarget(null);
      fetchVehiculos(offset);

    } catch (e: any) {
      setDeleteError(e.message);
    }

    setDeleteLoading(false);

  };

  return (

    <>

      <Toast toast={toast} />

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={() => fetchVehiculos(0)}
        filtrosActivos={Object.values(filtros).filter(v => v).length}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onNuevo={() => setShowCreate(true)}
      />

      {showFilters && (
        <FiltrosVehiculos
          filtros={{ ...filtros }}
          setFiltros={setFiltros}
          tipos={tipos}
          marcas={marcas}
        />
      )}

      <VehiculosTable
        vehiculos={vehiculos}
        marcas={marcas}
        tipos={tipos}
        loading={loading}
        onVer={handleVer}
        onEdit={(v: any) => {
          setEditTarget(v);
          // ✅ CORREGIDO: ahora también guarda id_marca al abrir el modal de editar
          setEditForm({
            matricula: v.matricula,
            estatus: v.estatus,
            id_tipo: v.id_tipo,
            id_marca: v.id_marca  // ✅ AÑADIDO
          });
        }}
        onDelete={(v: any) => setDeleteTarget(v)}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        <button
          disabled={offset === 0}
          onClick={handlePrev}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: offset === 0 ? "#ccc" : "#6c63ff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Anterior
        </button>

        <button
          disabled={vehiculos.length < limit}
          onClick={handleNext}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: vehiculos.length < limit ? "#ccc" : "#6c63ff",
            color: "white",
            cursor: "pointer"
          }}
        >
          Siguiente
        </button>

      </div>

      <ModalDetalle
        detalle={detalle}
        loading={detalleLoading}
        error={detalleError}
        onClose={() => setDetalle(null)}
        onViewHistory={handleVerHistorial}
      />

      <ModalEliminar
        target={deleteTarget}
        loading={deleteLoading}
        error={deleteError}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* ✅ CORREGIDO: ahora se pasa marcas al ModalCrear */}
      <ModalCrear
        show={showCreate}
        form={createForm}
        setForm={setCreateForm}
        tipos={tipos}
        marcas={marcas}
        loading={createLoading}
        error={createError}
        onClose={() => setShowCreate(false)}
        onSave={handleCreate}
      />

      {/* ✅ CORREGIDO: ahora se pasa marcas al ModalEditar */}
      <ModalEditar
        target={editTarget}
        form={editForm}
        setForm={setEditForm}
        tipos={tipos}
        marcas={marcas}
        loading={editLoading}
        error={editError}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
      />

      <ModalHistorialMantenimientos
        open={showHistorial}
        vehiculo={vehiculoHistorial}
        onClose={() => setShowHistorial(false)}
        onChangeVehiculo={(v: any) => {
          setVehiculoHistorial(v);
        }}
        fetchHistorial={fetchHistorial}
      />

    </>

  );

}