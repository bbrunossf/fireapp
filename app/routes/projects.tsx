// app/routes/projects.tsx
import { useState, useEffect } from 'react';
import { db } from '~/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Project {
  id?: string;
  name: string;
  budget: number;
}

interface Task {
  id?: string;
  taskName: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Novos estados para tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const handleAddOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update existing project
      const projectDoc = doc(db, 'projects', editingId);
      await updateDoc(projectDoc, { name, budget });
      setEditingId(null);
    } else {
      // Add new project
      await addDoc(collection(db, 'projects'), { name, budget });
    }
    setName('');
    setBudget(0);
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setName(project.name);
    setBudget(project.budget);
    setEditingId(project.id || null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
  };

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
    setProjects(projectsData);
  };

  // Novas funções para tarefas
  const handleAddOrUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId) {
      const taskDoc = doc(db, 'tasks', editingTaskId);
      await updateDoc(taskDoc, { taskName });
      setEditingTaskId(null);
    } else {
      await addDoc(collection(db, 'tasks'), { taskName });
    }
    setTaskName('');
    fetchTasks();
  };

  const handleEditTask = (task: Task) => {
    setTaskName(task.taskName);
    setEditingTaskId(task.id || null);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteDoc(doc(db, 'tasks', id));
    fetchTasks();
  };

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
    setTasks(tasksData);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seção de Projetos */}
        <div>
          <h1 className="text-2xl mb-4">Gerenciar Projetos</h1>
          <form onSubmit={handleAddOrUpdateProject} className="mb-4 space-y-2">
            <input
              type="text"
              name='name'
              placeholder="Nome do Projeto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="number"
              name='budget'
              placeholder="Orçamento"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
              {editingId ? 'Atualizar Projeto' : 'Adicionar Projeto'}
            </button>
          </form>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center justify-between border p-2 rounded">
                <span>{project.name} - R${project.budget}</span>
                <div>
                  <button onClick={() => handleEdit(project)} className="text-blue-500 mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(project.id!)} className="text-red-500">
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção de Tarefas */}
        <div>
          <h1 className="text-2xl mb-4">Gerenciar Tarefas</h1>
          <form onSubmit={handleAddOrUpdateTask} className="mb-4 space-y-2">
            <input
              type="text"
              placeholder="Nome da Tarefa"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-green-500 text-white p-2 w-full rounded">
              {editingTaskId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
            </button>
          </form>
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between border p-2 rounded">
                <span>{task.taskName}</span>
                <div>
                  <button onClick={() => handleEditTask(task)} className="text-blue-500 mr-2">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteTask(task.id!)} className="text-red-500">
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}