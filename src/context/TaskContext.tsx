import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: true,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  fetchTasks: async () => {},
});

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([response.data, ...tasks]);
    } catch (err) {
      console.error('Failed to add task:', err);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
