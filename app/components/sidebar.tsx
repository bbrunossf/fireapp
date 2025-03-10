import { Link, useLocation } from '@remix-run/react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Funcionários' },
    { to: '/projects', label: 'Projetos' },
    { to: '/time-entry', label: 'Registro de Horas' },
    { to: '/costs', label: 'Custos' },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">Sistema de Gestão</h1>
        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block p-2 rounded hover:bg-gray-700 transition-colors ${
                    location.pathname === link.to ? 'bg-gray-700' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}