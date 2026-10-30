import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export default function Casos() {
    const [casos, setCasos] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    const casosFiltrados = casos.filter((caso) => {
        const termino = busqueda.toLowerCase();
        return (
            (caso.numero_expediente && caso.numero_expediente.toLowerCase().includes(termino)) ||
            (caso.tipo_peritaje && caso.tipo_peritaje.toLowerCase().includes(termino))
        );
    });

    const [usuarios, setUsuarios] = useState([]);
    
    const [numeroExpediente, setNumeroExpediente] = useState('');
    const [tipoPeritaje, setTipoPeritaje] = useState('Informatico');
    const [estado, setEstado] = useState('Recibido');
    const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().split('T')[0]);
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [peritoSeniorId, setPeritoSeniorId] = useState('');
    const [peritoJuniorId, setPeritoJuniorId] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const cargarDatos = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [resCasos, resUsuarios] = await Promise.all([
                axios.get('http://localhost:3000/api/casos', { headers }),
                axios.get('http://localhost:3000/api/usuarios', { headers })
            ]);
            setCasos(resCasos.data);
            setUsuarios(resUsuarios.data);
        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:3000/api/casos', 
                { 
                    numero_expediente: numeroExpediente, 
                    tipo_peritaje: tipoPeritaje, 
                    estado, 
                    fecha_recepcion: fechaRecepcion,
                    fecha_vencimiento: fechaVencimiento || null,
                    perito_senior_id: peritoSeniorId,
                    perito_junior_id: peritoJuniorId || null
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNumeroExpediente('');
            setTipoPeritaje('Informatico');
            setEstado('Recibido');
            setFechaVencimiento('');
            setPeritoSeniorId('');
            setPeritoJuniorId('');
            cargarDatos();
        } catch (err) {
            console.error('Error al registrar:', err);
            setError(err.response?.data?.detalle || err.response?.data?.error || 'Error al registrar el expediente.');
        } finally {
            setLoading(false);
        }
    };

    // LÓGICA DE SEMAFORIZACIÓN
    const obtenerEstadoSemaforo = (fechaRecepcion, estadoCaso) => {
        if (estadoCaso === 'Cerrado' || estadoCaso === 'Presentado') return 'inactivo';
        
        const hoy = new Date();
        const recepcion = new Date(fechaRecepcion);
        const diferenciaDias = (hoy - recepcion) / (1000 * 60 * 60 * 24);
        
        if (diferenciaDias > 15) return 'rojo';
        if (diferenciaDias >= 10 && diferenciaDias <= 15) return 'amarillo';
        return 'verde';
    };

    // CÁLCULO DE ESTADÍSTICAS PARA EL DASHBOARD
    const stats = { activos: 0, verde: 0, amarillo: 0, rojo: 0 };
    casos.forEach(caso => {
        const estadoSemaforo = obtenerEstadoSemaforo(caso.fecha_recepcion, caso.estado);
        if (estadoSemaforo !== 'inactivo') {
            stats.activos++;
            stats[estadoSemaforo]++;
        }
    });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <h1 className="text-2xl font-bold tracking-wide text-cyan-400">Gestión de Expedientes</h1>
                <button 
                    onClick={() => { localStorage.clear(); navigate('/'); }}
                    className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Salir
                </button>
            </header>

            {/* DASHBOARD DE CONTROL VISUAL */}
            <div className="mb-8 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" /> Panel de Control de Plazos
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                        <p className="text-sm text-slate-400 font-medium">Expedientes Activos</p>
                        <p className="text-3xl font-bold text-slate-100">{stats.activos}</p>
                    </div>
                    <div className="bg-emerald-950/20 p-4 rounded-lg border border-emerald-900/50">
                        <p className="text-sm text-emerald-400/80 font-medium flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> En Término (&lt;10 días)</p>
                        <p className="text-3xl font-bold text-emerald-400">{stats.verde}</p>
                    </div>
                    <div className="bg-amber-950/20 p-4 rounded-lg border border-amber-900/50">
                        <p className="text-sm text-amber-400/80 font-medium flex items-center gap-1.5"><Clock className="w-4 h-4"/> Precaución (10-15 días)</p>
                        <p className="text-3xl font-bold text-amber-400">{stats.amarillo}</p>
                    </div>
                    <div className="bg-rose-950/20 p-4 rounded-lg border border-rose-900/50">
                        <p className="text-sm text-rose-400/80 font-medium flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Vencidos (&gt;15 días)</p>
                        <p className="text-3xl font-bold text-rose-400">{stats.rojo}</p>
                    </div>
                </div>

                {/* BARRA DE PROGRESO PROPORCIONAL */}
                <div className="w-full h-3 flex rounded-full overflow-hidden bg-slate-800">
                    {stats.activos > 0 ? (
                        <>
                            <div style={{ width: `${(stats.verde / stats.activos) * 100}%` }} className="bg-emerald-500 transition-all duration-500"></div>
                            <div style={{ width: `${(stats.amarillo / stats.activos) * 100}%` }} className="bg-amber-500 transition-all duration-500"></div>
                            <div style={{ width: `${(stats.rojo / stats.activos) * 100}%` }} className="bg-rose-600 transition-all duration-500"></div>
                        </>
                    ) : (
                        <div className="w-full bg-slate-800"></div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Nuevo Expediente */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-lg font-semibold mb-4 text-cyan-300">📂 Nuevo Expediente</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Nº de Expediente</label>
                            <input 
                                type="text"
                                value={numeroExpediente}
                                onChange={(e) => setNumeroExpediente(e.target.value)}
                                placeholder="Ej: EXP-1978/2026"
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Tipo de Peritaje</label>
                            <select 
                                value={tipoPeritaje}
                                onChange={(e) => setTipoPeritaje(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="Informatico">Informatico</option>
                                <option value="Ciberseguridad">Ciberseguridad</option>
                                <option value="OSINT">OSINT</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">F. Recepción</label>
                                <input 
                                    type="date"
                                    value={fechaRecepcion}
                                    onChange={(e) => setFechaRecepcion(e.target.value)}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">F. Vencimiento</label>
                                <input 
                                    type="date"
                                    value={fechaVencimiento}
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Perito Senior (Responsable)</label>
                            <select 
                                value={peritoSeniorId}
                                onChange={(e) => setPeritoSeniorId(e.target.value)}
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">Seleccione Perito Senior...</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre || u.usuario || `ID: ${u.id}`} ({u.rol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Perito Junior (Opcional)</label>
                            <select 
                                value={peritoJuniorId}
                                onChange={(e) => setPeritoJuniorId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="">Ninguno / Sin asignar</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre || u.usuario || `ID: ${u.id}`} ({u.rol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Estado Inicial</label>
                            <select 
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 focus:border-cyan-500 focus:outline-none"
                            >
                                <option value="Recibido">Recibido</option>
                                <option value="En análisis">En análisis</option>
                                <option value="Informe redactado">Informe redactado</option>
                                <option value="Presentado">Presentado</option>
                                <option value="Cerrado">Cerrado</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-3 rounded-lg transition duration-200 mt-2"
                        >
                            {loading ? 'Registrando...' : 'Crear Caso'}
                        </button>
                    </form>
                </div>

                {/* Listado de Expedientes Activos */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">Listado de Expedientes</h2>
                    
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar por N° de expediente o tipo de peritaje..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-400 transition shadow-sm"
                        />
                    </div>

                    {casosFiltrados.length === 0 ? (
                        <div className="bg-slate-800/20 border border-slate-800 p-8 rounded-xl text-center text-slate-500">
                            {busqueda ? 'No se encontraron expedientes con esa búsqueda.' : 'No hay expedientes registrados todavía.'}
                        </div>
                    ) : (
                        casosFiltrados.map((caso) => {
                            const semaforo = obtenerEstadoSemaforo(caso.fecha_recepcion, caso.estado);
                            
                            // Estilos dinámicos para las tarjetas según el semáforo
                            let borderClass = 'border-slate-800 hover:border-slate-700';
                            let bgClass = 'bg-slate-900';
                            let badgeClass = '';

                            if (semaforo === 'rojo') {
                                borderClass = 'border-rose-600/60';
                                bgClass = 'bg-rose-950/10';
                                badgeClass = 'bg-rose-950/80 text-rose-400 border-rose-700 animate-pulse';
                            } else if (semaforo === 'amarillo') {
                                borderClass = 'border-amber-500/60';
                                bgClass = 'bg-amber-950/10';
                                badgeClass = 'bg-amber-950/80 text-amber-400 border-amber-700';
                            } else if (semaforo === 'verde') {
                                borderClass = 'border-emerald-600/40';
                                bgClass = 'bg-emerald-950/10';
                            }

                            return (
                                <div 
                                    key={caso.id} 
                                    className={`${bgClass} border ${borderClass} p-5 rounded-xl flex justify-between items-center shadow-md transition mb-4`}
                                >
                                    <div>
                                        <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                                            <span className="font-bold text-lg text-cyan-400">{caso.numero_expediente}</span>
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
                                                {caso.estado}
                                            </span>
                                            {semaforo === 'rojo' && (
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeClass}`}>
                                                    ⚠️ Vencido (+15 días)
                                                </span>
                                            )}
                                            {semaforo === 'amarillo' && (
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeClass}`}>
                                                    ⏳ Alerta (10-15 días)
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1 font-medium">Tipo: {caso.tipo_peritaje}</p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Recibido: {caso.fecha_recepcion} {caso.fecha_vencimiento ? `| Vence: ${caso.fecha_vencimiento}` : ''}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/casos/${caso.id}`)}
                                        className="bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-400 text-sm font-semibold px-4 py-2.5 rounded-lg border border-slate-700 transition"
                                    >
                                        Ver Evidencias &rarr;
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}