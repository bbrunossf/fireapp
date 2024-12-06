// app/routes/dashboard.tsx
import { useState, useEffect } from 'react';
import { db } from '~/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Employee {
  id?: string;
  name: string;
  hourlyRate: number;
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
      setEmployees(employeesData);
    };
    fetchEmployees();
  }, []);

  const handleAddOrUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing employee
      const employeeDoc = doc(db, 'employees', editingId);
      await updateDoc(employeeDoc, { name, hourlyRate });
      setEditingId(null);
    } else {
      // Add new employee
      await addDoc(collection(db, 'employees'), { name, hourlyRate });
    }
    setName('');
    setHourlyRate(0);
    fetchEmployees();
  };

  const handleEdit = (employee: Employee) => {
    setName(employee.name);
    setHourlyRate(employee.hourlyRate);
    setEditingId(employee.id || null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'employees', id));
    fetchEmployees();
  };

  const fetchEmployees = async () => {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Employee[];
    setEmployees(employeesData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Gerenciar Funcionários</h1>
      <form onSubmit={handleAddOrUpdateEmployee} className="mb-4">
        <input
          type="text"
          name='name'
          placeholder="Nome do Funcionário"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="number"
          name='hourlyRate'
          placeholder="Custo por Hora"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          className="border p-2 mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {editingId ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}
        </button>
      </form>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id} className="mb-2">
            {employee.name} - R${employee.hourlyRate}/hora
            <button onClick={() => handleEdit(employee)} className="ml-2 text-blue-500">
              Editar
            </button>
            <button onClick={() => handleDelete(employee.id!)} className="ml-2 text-red-500">
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}