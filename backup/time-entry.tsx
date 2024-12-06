// app/routes/time-entry.tsx
import { useState } from 'react';
import { db } from '~/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function TimeEntry() {
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [hours, setHours] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'timeEntries'), {
        employeeId,
        projectId,
        taskId,
        hours,
        date: new Date(),
      });
      alert('Horas registradas com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar horas: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="text"
        placeholder="ID do Funcionário"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="ID do Projeto"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="ID da Tarefa"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="number"
        placeholder="Horas"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        className="border p-2 mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Registrar Horas
      </button>
    </form>
  );
}