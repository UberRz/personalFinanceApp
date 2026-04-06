import React, { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [backendStatus, setBackendStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/actuator/health');
        if (response.ok) {
          setBackendStatus('connected');
        }
      } catch {
        setBackendStatus('error');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const statusColor = 
    backendStatus === 'connected' ? 'bg-green-500' :
    backendStatus === 'error' ? 'bg-red-500' :
    'bg-yellow-500';

  const statusText =
    backendStatus === 'connected' ? '✓ Conectado' :
    backendStatus === 'error' ? '✗ Desconectado' :
    '⟳ Conectando...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-indigo-900">AppFinanzas</h1>
          </div>
          <Button 
            onClick={() => onNavigate('expenses')}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Ir a Gastos
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
          <div className="flex justify-center">
            <Wallet className="w-24 h-24 text-indigo-600" />
          </div>

          <h2 className="text-6xl font-bold text-indigo-900">
            ¡Bienvenido a AppFinanzas!
          </h2>

          <p className="text-2xl text-indigo-700 font-semibold">
            Tu Sistema de Gestión de Finanzas Personales
          </p>

          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Controla tus gastos, administra tu presupuesto y alcanza tus metas financieras
            </p>

            <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold ${statusColor}`}>
              Backend: {statusText}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Registra Gastos</h3>
              <p className="text-gray-600 text-sm">Categoriza y monitorea todos tus gastos</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Histórico Completo</h3>
              <p className="text-gray-600 text-sm">Visualiza tu historial de gastos organizado</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <AlertCircle className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Alertas Presupuesto</h3>
              <p className="text-gray-600 text-sm">Recibe notificaciones al superar límites</p>
            </div>
          </div>

          {/* Architecture Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Arquitectura del Proyecto</h3>
            <ul className="text-left space-y-3 text-gray-700">
              <li className="flex items-center">
                <span className="text-indigo-600 font-bold mr-2">✓</span>
                <span><strong>Frontend:</strong> React 18.3 + Tailwind CSS + Vite</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 font-bold mr-2">✓</span>
                <span><strong>Backend:</strong> Spring Boot 3.5 + Java 17</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 font-bold mr-2">✓</span>
                <span><strong>Database:</strong> PostgreSQL 15</span>
              </li>
              <li className="flex items-center">
                <span className="text-indigo-600 font-bold mr-2">✓</span>
                <span><strong>Contenedorización:</strong> Docker + Docker Compose</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              onClick={() => onNavigate('expenses')}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3"
            >
              Comenzar a Registrar Gastos
            </Button>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <p className="text-sm text-gray-600">
              🚀 El sistema está integrado con el backend y listo para usar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Para compatibilidad con importaciones default
export default Home;
