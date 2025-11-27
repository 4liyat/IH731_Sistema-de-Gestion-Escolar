import { useState, useEffect } from 'react';
import api from '../config/axios';
import { Plus, Search, Award, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Calificaciones() {
  const [calificaciones, setCalificaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    id_estudiante: '',
    id_curso: '',
    calificacion: '',
    periodo: '',
    tipo_evaluacion: 'parcial',
    observaciones: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [calRes, estRes, curRes] = await Promise.all([
        api.get('/calificaciones'),
        api.get('/estudiantes'),
        api.get('/cursos')
      ]);
      setCalificaciones(calRes.data.data || []);
      setEstudiantes(estRes.data.data || []);
      setCursos(curRes.data.data || []);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/calificaciones', formData);
      toast.success('Calificación registrada');
      setShowForm(false);
      setFormData({
        id_estudiante: '',
        id_curso: '',
        calificacion: '',
        periodo: '',
        tipo_evaluacion: 'parcial',
        observaciones: ''
      });
      // Refresh grades only
      const res = await api.get('/calificaciones');
      setCalificaciones(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrar calificación');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper to get names for display
  const getEstudianteName = (id) => {
    const est = estudiantes.find(e => e.id_estudiante === id);
    return est ? `${est.nombre} ${est.apellidos}` : `ID: ${id}`;
  };

  const getCursoName = (id) => {
    const cur = cursos.find(c => c.id_curso === id);
    return cur ? cur.nombre_curso : `ID: ${id}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Registro de Calificaciones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? 'Cancelar' : <><Plus size={20} /> Nueva Calificación</>}
        </button>
      </div>

      {showForm && (
        <div className="card animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Asignar Calificación</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estudiante</label>
              <select
                name="id_estudiante"
                value={formData.id_estudiante}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar Estudiante</option>
                {estudiantes.map(est => (
                  <option key={est.id_estudiante} value={est.id_estudiante}>
                    {est.matricula} - {est.nombre} {est.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
              <select
                name="id_curso"
                value={formData.id_curso}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar Curso</option>
                {cursos.map(cur => (
                  <option key={cur.id_curso} value={cur.id_curso}>
                    {cur.codigo_curso} - {cur.nombre_curso}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Calificación (0-100)</label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  name="calificacion"
                  value={formData.calificacion}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Periodo</label>
              <input
                name="periodo"
                value={formData.periodo}
                onChange={handleChange}
                required
                placeholder="2024-1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Evaluación</label>
              <select
                name="tipo_evaluacion"
                value={formData.tipo_evaluacion}
                onChange={handleChange}
                className="input-field"
              >
                <option value="parcial">Parcial</option>
                <option value="final">Final</option>
                <option value="proyecto">Proyecto</option>
                <option value="tarea">Tarea</option>
                <option value="examen">Examen</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  className="input-field pl-10"
                  rows="2"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Curso</th>
                <th className="px-6 py-4">Evaluación</th>
                <th className="px-6 py-4">Nota</th>
                <th className="px-6 py-4">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Cargando...</td></tr>
              ) : calificaciones.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No hay calificaciones registradas</td></tr>
              ) : (
                calificaciones.map((cal) => (
                  <tr key={cal.id_calificacion} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {getEstudianteName(cal.id_estudiante)}
                    </td>
                    <td className="px-6 py-4">
                      {getCursoName(cal.id_curso)}
                      <div className="text-xs text-slate-500">{cal.periodo}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                        {cal.tipo_evaluacion}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-bold ${
                        cal.calificacion >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {cal.calificacion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-xs">
                      {cal.observaciones || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
