// app/routes/index.tsx
import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Bem-vindo ao Sistema de Gestão</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Utilize o menu lateral para navegar entre as diferentes funcionalidades do sistema:
        </p>
        
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Gerencie funcionários e suas informações</li>
          <li>Cadastre e acompanhe projetos</li>
          <li>Registre horas trabalhadas</li>
          <li>Visualize relatórios de custos</li>
        </ul>
      </div>
    </div>
  );
}