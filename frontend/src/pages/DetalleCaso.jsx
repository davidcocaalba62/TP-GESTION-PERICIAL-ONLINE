import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, UploadCloud, FileText, Hash, ShieldCheck, CheckCircle2, Download, Search } from 'lucide-react';

export default function DetalleCaso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evidencias, setEvidencias] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // ESTADO Y LÓGICA DEL BUSCADOR (Nombre, Descripción, MD5 y SHA-256)
  const [busqueda, setBusqueda] = useState('');
  
  const evidenciasFiltradas = evidencias.filter((ev) => {
    const termino = busqueda.toLowerCase();
    
    const md5 = (ev.hash_md5 || ev.hashes?.md5 || '').toLowerCase();
    const sha256 = (ev.hash_sha256 || ev.hashes?.sha256 || '').toLowerCase();

    return (
      (ev.nombre_archivo && ev.nombre_archivo.toLowerCase().includes(termino)) ||
      (ev.descripcion && ev.descripcion.toLowerCase().includes(termino)) ||
      md5.includes(termino) ||
      sha256.includes(termino)
    );
  });

  useEffect(() => {
    cargarEvidencias();
  }, [id]);

  const cargarEvidencias = async () => {
    try {
      const response = await api.get(`/casos/${id}/evidencias`);
      setEvidencias(response.data);
    } catch (err) {
      console.error('Error al cargar evidencias:', err);
    }
  };

  const manejarSubida = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setError('Por favor seleccioná un archivo de evidencia.');
      return;
    }

    setError('');
    setExito('');
    setCargando(true);

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('descripcion', descripcion);

    try {
      const response = await api.post(`/casos/${id}/evidencias`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExito('¡Evidencia subida y procesada con estándar forense!');
      setDescripcion('');
      setArchivo(null);
      e.target.reset();
      cargarEvidencias();
    } catch (err) {
      console.error('Error subiendo evidencia:', err);
      setError(err.response?.data?.error || 'Error al procesar el archivo.');
    } finally {
      setCargando(false);
    }
  };

  const manejarDescarga = async (evidenciaId, nombreArchivo) => {
    try {
      const response = await api.get(`/casos/${id}/evidencias/${evidenciaId}/descargar`, {
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivo);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar la evidencia:', err);
      alert('Hubo un error al intentar descargar el archivo físico.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      {/* Botón Volver y Encabezado */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate('/casos')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Volver a Expedientes
        </button>
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
          <ShieldCheck className="w-5 h-5" /> Cadena de Custodia Digital
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de Carga de Evidencia */}
        <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-xl h-fit shadow-lg">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5" /> Cargar Nueva Evidencia
          </h2>

          {error && <div className="mb-4 p-3 bg-rose-500/20 text-rose-300 text-sm rounded-lg">{error}</div>}
          {exito && <div className="mb-4 p-3 bg-emerald-500/20 text-emerald-300 text-sm rounded-lg flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {exito}</div>}

          <form onSubmit={manejarSubida} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Descripción de la Evidencia</label>
              <textarea 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows="3"
                placeholder="Ej: Imagen de disco extraída durante el procedimiento..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Archivo de Prueba</label>
              <input 
                type="file"
                onChange={(e) => setArchivo(e.target.files[0])}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-slate-950 hover:file:bg-cyan-500 cursor-pointer"
              />
            </div>

            <button 
              type="submit"
              disabled={cargando}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold py-2.5 rounded-lg transition shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {cargando ? 'Calculando Hashes...' : 'Procesar Evidencia'}
            </button>
          </form>
        </div>

        {/* Listado de Evidencias Registradas */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">Evidencias en el Expediente #{id}</h2>

          {/* ÚNICA BARRA DE BÚSQUEDA VISUAL */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o Hash (MD5 / SHA-256)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-400 transition shadow-sm text-sm"
            />
          </div>

          {/* MAPEO CON EVIDENCIAS FILTRADAS */}
          {evidenciasFiltradas.length === 0 ? (
            <div className="bg-slate-800/20 border border-slate-800 p-8 rounded-xl text-center text-slate-500">
              {busqueda ? 'No se encontraron evidencias con esa búsqueda.' : 'No se han registrado evidencias ni archivos guardados en este caso.'}
            </div>
          ) : (
            evidenciasFiltradas.map((ev) => (
              <div key={ev.id} className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-slate-100">{ev.nombre_archivo}</h3>
                      <p className="text-sm text-slate-400">{ev.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono">
                      ID: #{ev.id}
                    </span>
                    <button 
                      onClick={() => manejarDescarga(ev.id, ev.nombre_archivo)}
                      className="flex items-center gap-1.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-slate-900 border border-cyan-800/50 text-xs px-3 py-1.5 rounded transition font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar
                    </button>
                  </div>
                </div>

                {/* Bloque de Hashes Cryptográficos */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Hash className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-500">MD5:</span>
                    <span className="text-amber-300 break-all">{ev.hash_md5 || ev.hashes?.md5}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Hash className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-500">SHA-256:</span>
                    <span className="text-cyan-300 break-all">{ev.hash_sha256 || ev.hashes?.sha256}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}