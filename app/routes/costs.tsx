// app/routes/costs.tsx
import { useEffect, useState } from 'react';
import { db } from '~/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Employee {
  id: string;
  name: string;
  hourlyRate: number;
}

interface Project {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  taskId: string;
  hours: number;
  date: Date;
}

interface CostSummary {
  projectId: string;
  taskId: string;
  totalHours: number;
  totalCost: number;
  details: {
    employeeId: string;
    hours: number;
    cost: number;
  }[];
}

export default function Costs() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [costSummary, setCostSummary] = useState<CostSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar funcionários
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
      setEmployees(employeesData);

      // Buscar projetos
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(projectsData);

      // Buscar registros de tempo
      const timeEntriesSnapshot = await getDocs(collection(db, 'timeEntries'));
      const timeEntriesData = timeEntriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      } as TimeEntry));
      setTimeEntries(timeEntriesData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    calculateCosts();
  }, [timeEntries, employees]);

  const calculateCosts = () => {
    const summaryMap = new Map<string, CostSummary>();

    timeEntries.forEach(entry => {
      const key = `${entry.projectId}-${entry.taskId}`;
      const employee = employees.find(e => e.id === entry.employeeId);
      
      if (!employee) return;

      const entryCost = entry.hours * employee.hourlyRate;
      
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          projectId: entry.projectId,
          taskId: entry.taskId,
          totalHours: 0,
          totalCost: 0,
          details: []
        });
      }

      const summary = summaryMap.get(key)!;
      summary.totalHours += entry.hours;
      summary.totalCost += entryCost;
      
      const existingDetail = summary.details.find(d => d.employeeId === entry.employeeId);
      if (existingDetail) {
        existingDetail.hours += entry.hours;
        existingDetail.cost += entryCost;
      } else {
        summary.details.push({
          employeeId: entry.employeeId,
          hours: entry.hours,
          cost: entryCost
        });
      }
    });

    setCostSummary(Array.from(summaryMap.values()));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Resumo de Custos por Projeto e Tarefa</h1>
      
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Projeto</th>
            <th className="border p-2 text-left">Tarefa</th>
            <th className="border p-2 text-right">Total Horas</th>
            <th className="border p-2 text-right">Custo Total</th>
          </tr>
        </thead>
        <tbody>
          {costSummary.map((summary, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border p-2">
                {projects.find(p => p.id === summary.projectId)?.name || summary.projectId}
              </td>
              <td className="border p-2">{summary.taskId}</td>
              <td className="border p-2 text-right">{summary.totalHours.toFixed(2)}</td>
              <td className="border p-2 text-right">
                R$ {summary.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-bold">
          <tr>
            <td colSpan={2} className="border p-2 text-right">Total Geral:</td>
            <td className="border p-2 text-right">
              {costSummary.reduce((acc, curr) => acc + curr.totalHours, 0).toFixed(2)}
            </td>
            <td className="border p-2 text-right">
              R$ {costSummary
                .reduce((acc, curr) => acc + curr.totalCost, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>

      <h2 className="text-xl font-bold mb-4">Detalhes por Funcionário</h2>
      {costSummary.map((summary, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg mb-2">
            Projeto: {projects.find(p => p.id === summary.projectId)?.name} - 
            Tarefa: {summary.taskId}
          </h3>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Funcionário</th>
                <th className="border p-2 text-right">Horas</th>
                <th className="border p-2 text-right">Custo</th>
              </tr>
            </thead>
            <tbody>
              {summary.details.map((detail, detailIndex) => (
                <tr key={detailIndex} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {employees.find(e => e.id === detail.employeeId)?.name || detail.employeeId}
                  </td>
                  <td className="border p-2 text-right">{detail.hours.toFixed(2)}</td>
                  <td className="border p-2 text-right">
                    R$ {detail.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}