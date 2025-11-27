import { useState, useEffect } from 'react';
import api from '../config/axios';
import { Plus, BookOpen, Hash, User, Calendar, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_curso: '',
    codigo_curso: '',
    descripcion: '',
    creditos: 3,
    profesor: '',
    periodo_academico: '',
    cupo_maximo: 30
  });

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await api.get('/cursos');
      setCursos(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cursos', formData);
      toast.success('Curso creado con éxito');
      setShowForm(false);
      setFormData({
        nombre_curso: '',
        codigo_curso: '',
        descripcion: '',
        creditos: 3,
        profesor: '',
        periodo_academico: '',
        cupo_maximo: 30
      });
      fetchCursos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear curso');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Cursos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? 'Cancelar' : <><Plus size={20} /> Nuevo Curso</>}
        </button>
      </div>

      {showForm && (
        <div className="card animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Crear Nuevo Curso</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Curso</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="nombre_curso"
                  value={formData.nombre_curso}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Introducción a la Programación"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="codigo_curso"
                  value={formData.codigo_curso}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="INF-101"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Periodo Académico</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="periodo_academico"
                  value={formData.periodo_academico}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="2024-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Profesor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="profesor"
                  value={formData.profesor}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Dr. Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Créditos</label>
                <input
                  type="number"
                  name="creditos"
                  value={formData.creditos}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cupo</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="number"
                    name="cupo_maximo"
                    value={formData.cupo_maximo}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="input-field"
                rows="2"
              />
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
                Guardar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full text-center py-8">Cargando...</div>
        ) : cursos.length === 0 ? (
           <div className="col-span-full text-center py-8 text-slate-500">No hay cursos registrados</div>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id_curso} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                  {curso.codigo_curso}
                </span>
                <span className="text-slate-400 text-xs">{curso.periodo_academico}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{curso.nombre_curso}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{curso.descripcion || 'Sin descripción'}</p>
              
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span>{curso.profesor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-slate-400" />
                  <span>{curso.creditos} Créditos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-400" />
                  <span>Cupo: {curso.cupo_maximo}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
