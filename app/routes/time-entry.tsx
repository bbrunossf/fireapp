// app/routes/time-entry.tsx
import { useState, useEffect } from 'react';
import { db } from '~/lib/firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId: string;
  hours: number;
  date: Date;
}

// Adicione estas interfaces
interface Employee {
    id: string;
    name: string;
  }
  
interface Project {
id: string;
name: string;
}

interface Summary {
    employeeId: string;
    projectId: string;
    totalHours: number;
  }

interface Task {
id: string;
taskName: string;
}

export default function TimeEntry() {
  const [employeeId, setEmployeeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState('');
  const [hours, setHours] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  //const [summary, setSummary] = useState<{ [key: string]: number }>({});
  const [summary, setSummary] = useState<Summary[]>([]);
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {

        const fetchTimeEntries = async () => {
        const querySnapshot = await getDocs(collection(db, 'timeEntries'));
        const entries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
            id: doc.id,
            employeeId: data.employeeId,
            projectId: data.projectId,
            taskId: data.taskId,
            hours: data.hours,
            date: (data.date as Timestamp).toDate(), // Convertendo Timestamp para Date
            };
        }) as TimeEntry[];
        setTimeEntries(entries);
        calculateSummary(entries);
        };

        // Adicione estas novas funções de busca
        const fetchEmployees = async () => {
            const querySnapshot = await getDocs(collection(db, 'employees'));
            const employeesList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            }));
            setEmployees(employeesList);
        };
    
        const fetchProjects = async () => {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setProjects(projectsList);
            };
        
        const fetchTasks = async () => {
            const querySnapshot = await getDocs(collection(db, 'tasks'));
            const tasksList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                taskName: doc.data().taskName,
            }));
            setTasks(tasksList);
            };

        await Promise.all([
            fetchTimeEntries(),
            fetchEmployees(),
            fetchProjects(),
            fetchTasks()
            ]);
    };

    fetchData();
  }, []);



const calculateSummary = (entries: TimeEntry[]) => {
    const summaryMap = new Map<string, number>();
    
    entries.forEach(entry => {
      const key = `${entry.employeeId}-${entry.projectId}`;
      const currentTotal = summaryMap.get(key) || 0;
      summaryMap.set(key, currentTotal + entry.hours);
    });

    const summaryArray: Summary[] = Array.from(summaryMap).map(([key, total]) => {
      const [employeeId, projectId] = key.split('-');
      return {
        employeeId,
        projectId,
        totalHours: total
      };
    });

    setSummary(summaryArray);
  };

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
      setEmployeeId('');
      setProjectId('');
      setTaskId('');
      setHours(0);
      fetchTimeEntries();
    } catch (error) {
      console.error('Erro ao registrar horas: ', error);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Selecione um Funcionário</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Selecione um Projeto</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        >
          <option value="">Selecione uma Tarefa</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.taskName}
            </option>
          ))}
        </select>


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

      <h2 className="text-xl mb-2">Entradas de Tempo</h2>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border p-2">Funcionário</th>
            <th className="border p-2">Projeto</th>
            <th className="border p-2">Tarefa</th>
            <th className="border p-2">Horas</th>
            <th className="border p-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map(entry => (
            <tr key={entry.id}>
              {/* <td className="border p-2">{entry.employeeId}</td>
              <td className="border p-2">{entry.projectId}</td> */}
              <td className="border p-2">
                {employees.find(e => e.id === entry.employeeId)?.name || entry.employeeId}
              </td>
              
              <td className="border p-2">
                {projects.find(p => p.id === entry.projectId)?.name || entry.projectId}
              </td>

              <td className="border p-2">
                {tasks.find(t => t.id === entry.taskId)?.taskName || entry.taskId}
              </td>
              
              <td className="border p-2">{entry.hours}</td>
              <td className="border p-2">{entry.date.toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl mb-2">Resumo de Horas por Projeto e Funcionário</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border p-2">Funcionário</th>
            <th className="border p-2">Projeto</th>
            <th className="border p-2">Total de Horas</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                {employees.find(e => e.id === item.employeeId)?.name || item.employeeId}
              </td>
              <td className="border p-2">
                {projects.find(p => p.id === item.projectId)?.name || item.projectId}
              </td>
              <td className="border p-2">{item.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}