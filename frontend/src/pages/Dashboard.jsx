import { useEffect, useState } from 'react';
import api from '../config/axios';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    estudiantes: 0,
    cursos: 0,
    promedio: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // En un escenario real, haríamos llamadas paralelas
        // Como no tenemos un endpoint de 'dashboard', obtenemos los totales manualmente
        // Esto es solo para demostración visual
        const [estRes, curRes] = await Promise.all([
          api.get('/estudiantes'),
          api.get('/cursos')
        ]);
        
        setStats({
          estudiantes: estRes.data.data ? estRes.data.data.length : 0,
          cursos: curRes.data.data ? curRes.data.data.length : 0,
          promedio: 8.5 // Simulado
        });
      } catch (error) {
        console.error("Error cargando stats", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Estudiantes', value: stats.estudiantes, icon: Users, color: 'bg-blue-500' },
    { title: 'Cursos Activos', value: stats.cursos, icon: BookOpen, color: 'bg-emerald-500' },
    { title: 'Promedio General', value: stats.promedio, icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card flex items-center gap-4">
            <div className={`p-4 rounded-lg text-white ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for future charts/activity */}
      <div className="card h-64 flex items-center justify-center text-slate-400 border-dashed">
        <p>Gráficos de actividad próximamente</p>
      </div>
    </div>
  );
}
